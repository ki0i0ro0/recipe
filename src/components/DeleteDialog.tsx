import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

const DeleteDialog = ({
  isOpen,
  onClose,
  onDelete,
}: {
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
}): JSX.Element => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent>
        <DialogTitle>削除しますか？</DialogTitle>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onDelete}>OK</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteDialog
