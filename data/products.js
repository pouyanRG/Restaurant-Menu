export const categories = ["All", "Burger", "Sides", "Chicken", "Pizza", "Drinks"];

export const products = [
  {
    id: 2, name: "Burger King", price: 8.5, discount: 10, image: "/images/burger.webp",
    category: "Burger", theme: "peach", imgClass: "img-burger",
    description: "A juicy beef patty with melted cheese, fresh lettuce and our house sauce.",
    time: 10, rating: 4.5, calories: 540,
    ingredients: ["Beef", "Cheese", "Lettuce", "Tomato", "Bun"]
  },
  {
    id: 3, name: "French Fries", price: 4.5, discount: 10, image: "/images/fries.webp",
    category: "Sides", theme: "black", imgClass: "img-fries",
    description: "Golden, crispy fries seasoned with a touch of sea salt.",
    time: 8, rating: 4.6, calories: 365,
    ingredients: ["Potatoes", "Sea salt", "Vegetable oil"]
  },
  {
    id: 6, name: "Chicken", price: 15.5, discount: 10, image: "/images/chicken.webp",
    category: "Chicken", theme: "orange", imgClass: "img-chicken",
    description: "Crispy, tender chicken pieces seasoned with our signature spices.",
    time: 18, rating: 4.7, calories: 680,
    ingredients: ["Chicken", "Flour", "Spices", "Vegetable oil"]
  },
  {
    id: 1, name: "Pizza", price: 6.5, discount: 10, image: "/images/pizza.webp",
    category: "Pizza", theme: "yellow", imgClass: "img-pizza",
    description: "Freshly baked pizza topped with tomato sauce, cheese and herbs.",
    time: 15, rating: 4.4, calories: 590,
    ingredients: ["Dough", "Tomato sauce", "Mozzarella", "Herbs"]
  },
  {
    id: 18, name: "Classic Cola", price: 4.5, discount: 10, image: "/images/drink-black.webp",
    category: "Drinks", theme: "red", imgClass: "img-drink",
    description: "A refreshing, ice-cold classic cola.",
    time: 2, rating: 4.3, calories: 150,
    ingredients: ["Carbonated water", "Cola syrup", "Ice"]
  },
  {
    id: 19, name: "Blue Lagoon", price: 5.5, discount: 10, image: "/images/drink-blue.webp",
    category: "Drinks", theme: "blue", imgClass: "img-drink",
    description: "A cool, citrusy blue drink served over ice.",
    time: 3, rating: 4.5, calories: 180,
    ingredients: ["Lemon", "Blue syrup", "Carbonated water", "Ice"]
  },
  {
    id: 5, name: "Hot Dog", price: 5.5, discount: 10, image: "/images/hot-dog.webp",
    category: "Burger", theme: "orange", imgClass: "img-hot-dog",
    description: "A grilled sausage in a soft bun with classic toppings.",
    time: 8, rating: 4.2, calories: 410,
    ingredients: ["Sausage", "Bun", "Mustard", "Onion"]
  },
  {
    id: 4, name: "Alfredo Pasta", price: 3.5, discount: 15, image: "/images/penne-pasta.webp",
    category: "Sides", theme: "blue", imgClass: "img-pasta",
    description: "Creamy Alfredo sauce tossed with tender pasta and parmesan.",
    time: 14, rating: 4.6, calories: 620,
    ingredients: ["Pasta", "Cream", "Parmesan", "Butter"]
  },
  {
    id: 7, name: "Caesar Salad", price: 7.0, discount: 10, image: "/images/salad.webp",
    category: "Sides", theme: "green", imgClass: "img-caesar",
    description: "Crispy or grilled roll with lettuce, special Caesar dressing, cherry tomatoes, olives, croutons, and grated Parmesan cheese.",
    time: 7, rating: 4.4, calories: 240,
    ingredients: ["Crispy or grilled roll", "Lettuce", "Special Caesar dressing", "Cherry tomatoes", "Olives", "Croutons", "Grated Parmesan cheese"]
  },
  {
    id: 20, name: "Orange Juice", price: 4.0, discount: 5, image: "/images/drink-yellow.svg",
    category: "Drinks", theme: "orange", imgClass: "img-drink",
    description: "Bright, freshly squeezed orange juice.",
    time: 3, rating: 4.7, calories: 112,
    ingredients: ["Orange"]
  }
];

export const getProduct = (id) => products.find((p) => p.id === Number(id));

export const navItems = [
  { id: "home", label: "Home" },
  { id: "message", label: "Message" },
  { id: "favorite", label: "Favorite" },
  { id: "profile", label: "Profile" }
];
