import {
  useAddItem,
  useAddImage,
  useUpdateItem,
  useUpdateImage,
} from "../api/admin/mutations";
import { type Item } from "../api/openapi";

export function useItemSubmit() {
  const { mutate: addItem } = useAddItem();
  const { mutate: addImage } = useAddImage();
  const { mutate: updateItem } = useUpdateItem();
  const { mutate: updateImage } = useUpdateImage();

  const handleMutation = <TArgs>(
    mutationFn: (
      args: TArgs,
      callbacks: {
        onSuccess?: (res: any) => void;
        onError?: (err: any) => void;
      }
    ) => void,
    args: TArgs,
    {
      onSuccess,
      onError,
    }: { onSuccess?: (res: any) => void; onError?: (err: any) => void } = {}
  ) => {
    mutationFn(args, {
      onSuccess,
      onError,
    });
  };

  const withAlerts = <TArgs>(
    mutationFn: (
      args: TArgs,
      callbacks: {
        onSuccess?: (res: any) => void;
        onError?: (err: any) => void;
      }
    ) => void,
    args: TArgs,
    {
      successMsg,
      errorMsg,
    }: {
      successMsg: string;
      errorMsg: string;
    }
  ) => {
    handleMutation(mutationFn, args, {
      onSuccess: () => {
        alert(successMsg);
      },
      onError: (err: any) => {
        alert(
          `${errorMsg}\nError: ${err?.id || err?.message || err}`
        );
      },
    });
  };

  const createImageMutation = async ({
    itemId,
    imageData,
  }: {
    itemId: string;
    imageData: File;
  }) => {
    withAlerts(
      addImage,
      { itemId, file: imageData },
      {
        successMsg: "Item and Image added successfully!",
        errorMsg: "Item added successfully. Failed to add image. Please try again.",
      }
    );
  };
  const createItemWithImage = async ({
    item,
    imageData,
  }: {
    item: Item;
    imageData?: File;
  }) => {
    handleMutation(addItem, item, {
      onSuccess: (res: any) => {
        const itemId = res?.data?.id || item.id;
        if (imageData) {
          createImageMutation({ itemId, imageData });
        } else {
          alert("Item added successfully!");
        }
      },
      onError: (err: any) => {
        alert(
          `Failed to submit the item. Please try again.\nError: ${
            err?.id || err?.message || err
          }`
        );
      },
    });
  };
  const updateImageMutation = async ({
    itemId,
    imageData,
  }: {
    itemId: string;
    imageData: File;
  }) => {
    withAlerts(
      updateImage,
      { itemId, file: imageData },
      {
        successMsg: "Image updated successfully!",
        errorMsg: "Failed to update the image. Please try again.",
      }
    );
  };
  const updateItemWithImage = async ({
    item,
    imageData,
  }: {
    item: Item;
    imageData?: File;
  }) => {
    handleMutation(updateItem, item, {
      onSuccess: () => {
        alert("Item updated successfully!");
        if (imageData) {
          updateImageMutation({ itemId: item.id, imageData });
        }
      },
      onError: (err: any) => {
        alert(
          `Failed to update the item. Please try again.\nError: ${
            err?.id || err?.message || err
          }`
        );
      },
    });
  };

  return {
    handleMutation,
    withAlerts,
    createItemWithImage,
    createImageMutation,
    updateImageMutation,
    updateItemWithImage,
  };
}
