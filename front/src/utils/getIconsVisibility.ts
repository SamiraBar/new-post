export const getIconsVisibility = function (
  status: string,
  isPaid: boolean,
  partnerStickerReceived: boolean,
) {
  switch (status) {
    case 'draft':
      return { showPaidIcon: false, showPartnerStickerIcon: false };
    case 'created':
      return { showPaidIcon: isPaid, showPartnerStickerIcon: false };
    default:
      return { showPaidIcon: true, showPartnerStickerIcon: partnerStickerReceived };
  }
}
