import express from 'express';
import {
  createOffice,
  deleteOffice,
  getAdminOffices,
  getOfficeById,
  getOffices,
  updateOffice
} from '../controllers/offices';
import auth from '../middleware/auth';
import permit from '../middleware/permit';

const officeRouter = express.Router();

officeRouter.get('/', getOffices);
officeRouter.get('/admin', auth, permit('superAdmin'), getAdminOffices);
officeRouter.post('/', auth, permit('superAdmin'), createOffice);
officeRouter.get('/:id', getOfficeById);
officeRouter.patch('/:id', auth, permit('superAdmin'), updateOffice);
officeRouter.delete('/:id', auth, permit('superAdmin'), deleteOffice);

export default officeRouter;