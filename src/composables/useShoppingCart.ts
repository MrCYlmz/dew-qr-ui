import { inject } from 'vue';

export function useShoppingCart() {
  const shoppingCart = inject<{ items: { itemId: string; name: string; quantity: number; price: number }[] }>('shoppingCart');
  if (!shoppingCart) {
    throw new Error('ShoppingCart is not provided');
  }

  const addItem = (item: { itemId: string; name: string; price: number }) => {
    const existingItem = shoppingCart.items.find(cartItem => cartItem.itemId === item.itemId);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      shoppingCart.items.push({ ...item, quantity: 1 });
    }
  };

  const removeItem = (itemId: string) => {
    const index = shoppingCart.items.findIndex(cartItem => cartItem.itemId === itemId);
    if (index !== -1) {
      shoppingCart.items.splice(index, 1);
    }
  };

  const clearCart = () => {
    shoppingCart.items.splice(0, shoppingCart.items.length);
  };

  return {
    shoppingCart,
    addItem,
    removeItem,
    clearCart,
  };
}