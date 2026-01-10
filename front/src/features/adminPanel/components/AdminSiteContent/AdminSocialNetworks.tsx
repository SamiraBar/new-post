import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import axiosApi from '@/axiosApi';
import { GripVertical, Pencil, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SocialNetwork {
  _id: string;
  name: string;
  url: string;
  icon: string;
  order: number;
}

interface SortableItemProps {
  social: SocialNetwork;
  onEdit: (social: SocialNetwork) => void;
  onDelete: (id: string) => void;
}

const SortableItem = ({ social, onEdit, onDelete }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: social._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={`${import.meta.env.VITE_API_URL}/${social.icon}`}
                alt={social.name}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.currentTarget.src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E';
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 truncate">{social.name}</h4>
              <p className="text-sm text-gray-500 truncate">{social.url}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(social)} className="gap-2">
              <Pencil className="h-3.5 w-3.5" />
              Редактировать
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(social._id)}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Удалить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AdminSocialNetworksProps {
  onSocialsChange?: (socials: SocialNetwork[]) => void;
}

const AdminSocialNetworks = ({ onSocialsChange }: AdminSocialNetworksProps) => {
  const [socials, setSocials] = useState<SocialNetwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialNetwork | null>(null);

  const [formName, setFormName] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formIcon, setFormIcon] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const loadSocials = async () => {
    try {
      const { data } = await axiosApi.get('/social-networks');
      setSocials(data.socialNetworks || []);
      if (onSocialsChange) {
        onSocialsChange(data.socialNetworks || []);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    void loadSocials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = socials.findIndex((s) => s._id === active.id);
    const newIndex = socials.findIndex((s) => s._id === over.id);

    const reordered = arrayMove(socials, oldIndex, newIndex);
    const withNewOrder = reordered.map((s, i) => ({ ...s, order: i }));

    setSocials(withNewOrder);
    if (onSocialsChange) {
      onSocialsChange(withNewOrder);
    }

    try {
      await axiosApi.patch('/social-networks/reorder', {
        items: withNewOrder.map((s) => ({ id: s._id, order: s.order })),
      });
      toast.success('Порядок изменен');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      await loadSocials();
    }
  };

  const openAddDialog = () => {
    setEditingSocial(null);
    setFormName('');
    setFormUrl('');
    setFormIcon(null);
    setIconPreview('');
    setDialogOpen(true);
  };

  const openEditDialog = (social: SocialNetwork) => {
    setEditingSocial(social);
    setFormName(social.name);
    setFormUrl(social.url);
    setFormIcon(null);
    setIconPreview(`${import.meta.env.VITE_API_URL}/${social.icon}`);
    setDialogOpen(true);
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      toast.error('Размер файла не должен превышать 500KB');
      return;
    }

    setFormIcon(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setIconPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!formName.trim()) {
      toast.error('Введите название');
      return;
    }

    if (!formUrl.trim()) {
      toast.error('Введите URL');
      return;
    }

    if (!/^https?:\/\/.+/.test(formUrl)) {
      toast.error('URL должен начинаться с http:// или https://');
      return;
    }

    if (!editingSocial && !formIcon) {
      toast.error('Загрузите иконку');
      return;
    }

    const existingWithSameName = socials.find(
      (s) => s.name.toLowerCase() === formName.trim().toLowerCase() && s._id !== editingSocial?._id,
    );
    if (existingWithSameName) {
      toast.error('Социальная сеть с таким названием уже существует');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', formName.trim());
      formData.append('url', formUrl.trim());
      if (formIcon) {
        formData.append('icon', formIcon);
      }

      if (editingSocial) {
        await axiosApi.patch(`/social-networks/${editingSocial._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Социальная сеть обновлена');
      } else {
        await axiosApi.post('/social-networks', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Социальная сеть добавлена');
      }

      setDialogOpen(false);
      await loadSocials();
    } catch (error) {
      if (error instanceof Error) {
        const message =
          (error as { response?: { data?: { error?: string } } }).response?.data?.error ||
          error.message;
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту социальную сеть?')) return;

    setLoading(true);
    try {
      await axiosApi.delete(`/social-networks/${id}`);
      toast.success('Социальная сеть удалена');
      await loadSocials();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="rounded-2xl border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl font-semibold">Социальные сети</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {socials.length}/6 • Перетаскивайте для изменения порядка
              </p>
            </div>
            <Button
              onClick={openAddDialog}
              disabled={loading || socials.length >= 6}
              className="bg-brand hover:bg-amber-600 gap-2"
            >
              <Plus className="h-4 w-4" />
              Добавить
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pb-8">
          {socials.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Нет социальных сетей</p>
              <p className="text-sm">Добавьте первую социальную сеть</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={socials.map((s) => s._id)}
                strategy={verticalListSortingStrategy}
              >
                {socials.map((social) => (
                  <SortableItem
                    key={social._id}
                    social={social}
                    onEdit={openEditDialog}
                    onDelete={handleDelete}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSocial ? 'Редактировать социальную сеть' : 'Добавить социальную сеть'}
            </DialogTitle>
            <DialogDescription>
              {editingSocial
                ? 'Измените информацию о социальной сети'
                : 'Добавьте новую социальную сеть в футер сайта'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                placeholder="WhatsApp"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="https://wa.me/996778465557"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Иконка (PNG, JPG, SVG, WEBP, до 500KB)</Label>
              <Input
                id="icon"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                onChange={handleIconChange}
              />
              {iconPreview && (
                <div className="mt-2 p-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center gap-3">
                  <img src={iconPreview} alt="Preview" className="w-12 h-12 object-contain" />
                  <span className="text-sm text-gray-600">Предпросмотр</span>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={loading}>
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-brand hover:bg-amber-600"
            >
              {loading ? 'Сохранение...' : editingSocial ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminSocialNetworks;
