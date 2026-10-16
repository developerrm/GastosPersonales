import Swal from 'sweetalert2';

const alertDialog = Swal.mixin({
  background: '#1f2937',
  color: '#f3f4f6',
  confirmButtonColor: '#d97706',
  cancelButtonColor: '#475569',
});

export const showErrorAlert = (message) => alertDialog.fire({
  icon: 'error',
  title: 'Error',
  text: message,
});

export const showWarningAlert = (message) => alertDialog.fire({
  icon: 'warning',
  title: 'Atención',
  text: message,
});

export const confirmAction = async (title, text) => {
  const result = await alertDialog.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
  });

  return result.isConfirmed;
};
