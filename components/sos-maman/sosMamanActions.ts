import { showActionSheet, showConfirmAlert } from '@/lib/ui/actionSheet';

type OwnActions = {
  isOwner: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
};

export function showSosContentActions({ isOwner, onEdit, onDelete, onReport }: OwnActions) {
  const buttons: { text: string; style?: 'destructive' | 'cancel'; onPress?: () => void }[] = [];

  if (isOwner && onEdit) {
    buttons.push({ text: 'Modifier', onPress: onEdit });
  }
  if (isOwner && onDelete) {
    buttons.push({
      text: 'Supprimer',
      style: 'destructive',
      onPress: () => {
        showConfirmAlert('Supprimer ?', 'Cette action est définitive.', 'Supprimer', onDelete, {
          destructive: true,
        });
      },
    });
  }
  if (!isOwner && onReport) {
    buttons.push({
      text: 'Signaler',
      style: 'destructive',
      onPress: () => {
        showConfirmAlert(
          'Signaler ce contenu ?',
          'Notre équipe examinera ce signalement.',
          'Signaler',
          onReport,
          { destructive: true },
        );
      },
    });
  }
  buttons.push({ text: 'Annuler', style: 'cancel' });

  if (buttons.length <= 1) return;
  showActionSheet('Options', buttons);
}
