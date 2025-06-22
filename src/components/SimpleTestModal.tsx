import { Dialog, DialogTitle, DialogContent, Button, Typography } from '@mui/material';

interface SimpleTestModalProps {
  open: boolean;
  onClose: () => void;
}

const SimpleTestModal = ({ open, onClose }: SimpleTestModalProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Test Modal</DialogTitle>
      <DialogContent>
        <Typography>This is a test modal. If you see this, the modal system works!</Typography>
        <Button onClick={onClose} sx={{ mt: 2 }}>Close</Button>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleTestModal;