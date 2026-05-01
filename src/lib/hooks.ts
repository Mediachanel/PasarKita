/**
 * Custom Hooks untuk Pasar Kita
 */

import { useState, useEffect, useCallback } from "react";

// Hook untuk mengelola state user
export const useUser = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user dari localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return { user, loading, logout };
};

// Hook untuk mengelola cart
export const useCart = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  const addItem = useCallback((product: any, quantity: number = 1) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        const updated = prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        localStorage.setItem("cart", JSON.stringify(updated));
        return updated;
      } else {
        const updated = [...prev, { ...product, quantity }];
        localStorage.setItem("cart", JSON.stringify(updated));
        return updated;
      }
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.id !== productId);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) => {
      const updated = prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  }, [removeItem]);

  const clear = useCallback(() => {
    setItems([]);
    localStorage.removeItem("cart");
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    total,
    itemCount,
  };
};

// Hook untuk mengelola form
export const useForm = (initialValues: any, onSubmit: (data: any) => void) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setValues((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: any) => {
    const { name } = e.target;
    setTouched((prev: any) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    setErrors,
  };
};

// Hook untuk fetch data
export const useFetch = (url: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch");
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// Hook untuk local storage
export const useLocalStorage = (key: string, initialValue: any) => {
  const [storedValue, setStoredValue] = useState<any>(initialValue);

  useEffect(() => {
    const item = localStorage.getItem(key);
    if (item) {
      setStoredValue(JSON.parse(item));
    }
  }, [key]);

  const setValue = (value: any) => {
    setStoredValue(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue];
};
