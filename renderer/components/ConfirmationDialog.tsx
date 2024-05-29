import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  UseDisclosureProps,
} from "@chakra-ui/react";
import { useRef } from "react";

interface ConfirmationDialogProps {
  title: string;
  description: string;
  alertDialogProps: UseDisclosureProps;
  disableYes?: boolean
  cancelText?: string
  onCancel: () => void;
  onYes: () => void;
}

const ConfirmationDialog = ({
  title,
  description,
  alertDialogProps,
  disableYes = false,
  cancelText = 'Cancelar',
  onCancel,
  onYes,  
}: ConfirmationDialogProps) => {
  const cancelRef = useRef();

  const handleCancel = () => {
    alertDialogProps.onClose();
    onCancel();
  };

  const handleYes = () => {
    alertDialogProps.onClose();
    onYes();
  };

  return (
    <AlertDialog
      isOpen={alertDialogProps.isOpen}
      leastDestructiveRef={cancelRef}
      onClose={alertDialogProps.onClose}
      closeOnOverlayClick={false}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>{description}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={handleCancel}>
              {cancelText}
            </Button>
            {!disableYes &&
              <Button colorScheme="purple" onClick={handleYes} ml={3}>
                Sim
              </Button>
            }
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export { ConfirmationDialog };
