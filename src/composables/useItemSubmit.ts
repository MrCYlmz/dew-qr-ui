import { useAddItem, useAddImage, useUpdateItem, useUpdateImage } from "../api/admin/mutations";
import { type Item } from "../api/openapi";

export function useItemSubmit() {
  const { mutate: addItem } = useAddItem();
  const { mutate: addImage } = useAddImage();
  const { mutate: updateItem } = useUpdateItem();
  const { mutate: updateImage } = useUpdateImage();

  const handleMutation = (
    mutationFn: (item: Item, callbacks: any) => void,
    item: Item,
    imageData?: File,
    imageMutationFn?: (data: { itemId: string; file: File }) => void
  ) => {
    mutationFn(item, {
      onSuccess: (res: any) => {
        const itemId = res?.data?.id || item.id;
        if (imageData && imageMutationFn) {
          imageMutationFn({ itemId, file: imageData });
        }
        // Handle success (e.g., show a success message)
      },
      onError: () => {
        // Handle error (e.g., show an error message)
      },
    });
  };

  const handleSubmit = async ({
    item,
    imageData,
    isUpdate = false,
  }: {
    item: Item;
    imageData?: File;
    isUpdate?: boolean;
  }) => {
    try {
      if (isUpdate) {
        handleMutation(updateItem, item, imageData, updateImage);
      } else {
        handleMutation(addItem, item, imageData, addImage);
      }
    } catch (error) {
      // Handle error (e.g., show an error message)
    }
  };

  return { handleSubmit };
}
