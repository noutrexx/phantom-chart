import type { MenuItem, OptionGroup, Restaurant } from "../types";

// Cuisine-appropriate customization groups, derived at runtime from the
// restaurant's tag so every dish gets realistic, varied options without
// hand-authoring them per item.

const single = (id: string, label: string, required: boolean, choices: OptionGroup["choices"]): OptionGroup => ({
  id,
  label,
  type: "single",
  required,
  choices,
});
const multi = (id: string, label: string, choices: OptionGroup["choices"]): OptionGroup => ({
  id,
  label,
  type: "multi",
  choices,
});

const GROUPS: Record<string, OptionGroup[]> = {
  burger: [
    single("size", "Size", true, [
      { id: "single", label: "Single patty", delta: 0 },
      { id: "double", label: "Double patty", delta: 3.0 },
    ]),
    single("doneness", "Cook", true, [
      { id: "med", label: "Medium", delta: 0 },
      { id: "well", label: "Well done", delta: 0 },
    ]),
    multi("addons", "Add-ons", [
      { id: "bacon", label: "Smoked bacon", delta: 1.75 },
      { id: "cheese", label: "Extra cheese", delta: 1.25 },
      { id: "avocado", label: "Avocado", delta: 1.5 },
      { id: "egg", label: "Fried egg", delta: 1.25 },
    ]),
  ],
  chicken: [
    single("sauce", "Sauce", true, [
      { id: "gochujang", label: "Gochujang", delta: 0 },
      { id: "soygarlic", label: "Soy garlic", delta: 0 },
      { id: "honey", label: "Honey butter", delta: 0.5 },
      { id: "plain", label: "Plain", delta: 0 },
    ]),
    single("spice", "Spice level", true, [
      { id: "mild", label: "Mild", delta: 0 },
      { id: "medium", label: "Medium", delta: 0 },
      { id: "fire", label: "Fire 🔥", delta: 0 },
    ]),
    multi("addons", "Add-ons", [
      { id: "dip", label: "Extra dip", delta: 0.75 },
      { id: "radish", label: "Pickled radish", delta: 1.0 },
      { id: "cheese", label: "Cheese dust", delta: 1.25 },
    ]),
  ],
  taco: [
    single("protein", "Protein", true, [
      { id: "pastor", label: "Al pastor", delta: 0 },
      { id: "carnitas", label: "Carnitas", delta: 0 },
      { id: "chicken", label: "Grilled chicken", delta: 0 },
      { id: "veggie", label: "Veggie", delta: 0 },
    ]),
    multi("addons", "Add-ons", [
      { id: "guac", label: "Extra guac", delta: 1.5 },
      { id: "queso", label: "Queso", delta: 1.25 },
      { id: "jalapeno", label: "Jalapeños", delta: 0.5 },
      { id: "crema", label: "Sour cream", delta: 0.75 },
    ]),
    multi("meal", "Make it a meal", [
      { id: "chips", label: "Chips & salsa", delta: 3.0 },
      { id: "horchata", label: "Horchata", delta: 2.5 },
    ]),
  ],
  noodle: [
    single("spice", "Spice level", true, [
      { id: "mild", label: "Mild", delta: 0 },
      { id: "medium", label: "Medium", delta: 0 },
      { id: "hot", label: "Extra hot 🔥", delta: 0 },
    ]),
    multi("addons", "Add-ons", [
      { id: "egg", label: "Extra egg", delta: 1.5 },
      { id: "protein", label: "Extra protein", delta: 3.0 },
      { id: "corn", label: "Sweet corn", delta: 1.0 },
      { id: "noodles", label: "Extra noodles", delta: 2.0 },
    ]),
  ],
  sushi: [
    single("wasabi", "Wasabi", true, [
      { id: "regular", label: "Regular", delta: 0 },
      { id: "none", label: "No wasabi", delta: 0 },
      { id: "extra", label: "Extra", delta: 0.5 },
    ]),
    multi("addons", "Add-ons", [
      { id: "ginger", label: "Extra ginger", delta: 0.5 },
      { id: "spicymayo", label: "Spicy mayo", delta: 0.75 },
      { id: "soypaper", label: "Soy paper wrap", delta: 0.75 },
    ]),
  ],
  pizza: [
    single("size", "Size", true, [
      { id: "10", label: '10" personal', delta: 0 },
      { id: "14", label: '14" medium', delta: 4.0 },
      { id: "18", label: '18" large', delta: 7.0 },
    ]),
    single("crust", "Crust", true, [
      { id: "classic", label: "Classic", delta: 0 },
      { id: "thin", label: "Thin & crispy", delta: 0 },
      { id: "stuffed", label: "Stuffed crust", delta: 2.5 },
    ]),
    multi("toppings", "Extra toppings", [
      { id: "cheese", label: "Extra cheese", delta: 1.5 },
      { id: "pepperoni", label: "Pepperoni", delta: 2.0 },
      { id: "mushroom", label: "Mushrooms", delta: 1.5 },
      { id: "honey", label: "Hot honey", delta: 1.0 },
    ]),
  ],
  healthy: [
    single("base", "Base", true, [
      { id: "greens", label: "Mixed greens", delta: 0 },
      { id: "brown", label: "Brown rice", delta: 0 },
      { id: "quinoa", label: "Quinoa", delta: 0.75 },
    ]),
    single("dressing", "Dressing", true, [
      { id: "sesame", label: "Sesame", delta: 0 },
      { id: "tahini", label: "Lemon tahini", delta: 0 },
      { id: "citrus", label: "Citrus vinaigrette", delta: 0 },
    ]),
    multi("protein", "Add protein", [
      { id: "chicken", label: "Grilled chicken", delta: 3.0 },
      { id: "tofu", label: "Crispy tofu", delta: 2.0 },
      { id: "salmon", label: "Seared salmon", delta: 4.0 },
      { id: "avocado", label: "Avocado", delta: 1.5 },
    ]),
  ],
  indian: [
    single("spice", "Spice level", true, [
      { id: "mild", label: "Mild", delta: 0 },
      { id: "medium", label: "Medium", delta: 0 },
      { id: "hot", label: "Hot 🔥", delta: 0 },
    ]),
    multi("addons", "Add-ons", [
      { id: "naan", label: "Extra garlic naan", delta: 2.5 },
      { id: "rice", label: "Extra basmati", delta: 2.0 },
      { id: "raita", label: "Cucumber raita", delta: 1.5 },
      { id: "papad", label: "Papad", delta: 1.0 },
    ]),
  ],
  sweet: [
    single("size", "Size", true, [
      { id: "single", label: "Single", delta: 0 },
      { id: "sharing", label: "Sharing", delta: 3.0 },
    ]),
    multi("toppings", "Toppings", [
      { id: "scoop", label: "Extra scoop", delta: 1.5 },
      { id: "fudge", label: "Hot fudge", delta: 1.0 },
      { id: "berries", label: "Fresh berries", delta: 1.25 },
      { id: "cream", label: "Whipped cream", delta: 0.75 },
    ]),
  ],
  coffee: [
    single("size", "Size", true, [
      { id: "s", label: "Small", delta: 0 },
      { id: "m", label: "Medium", delta: 0.6 },
      { id: "l", label: "Large", delta: 1.1 },
    ]),
    single("milk", "Milk", true, [
      { id: "whole", label: "Whole", delta: 0 },
      { id: "skim", label: "Skim", delta: 0 },
      { id: "oat", label: "Oat", delta: 0.6 },
      { id: "almond", label: "Almond", delta: 0.6 },
    ]),
    multi("extras", "Extras", [
      { id: "shot", label: "Extra shot", delta: 0.8 },
      { id: "vanilla", label: "Vanilla syrup", delta: 0.5 },
      { id: "caramel", label: "Caramel syrup", delta: 0.5 },
    ]),
  ],
  thai: [
    single("spice", "Spice level", true, [
      { id: "mild", label: "Mild", delta: 0 },
      { id: "medium", label: "Medium", delta: 0 },
      { id: "thai", label: "Thai hot 🔥", delta: 0 },
    ]),
    multi("addons", "Add-ons", [
      { id: "peanuts", label: "Extra peanuts", delta: 0.75 },
      { id: "egg", label: "Fried egg", delta: 1.25 },
      { id: "shrimp", label: "Add shrimp", delta: 3.0 },
      { id: "tofu", label: "Add tofu", delta: 2.0 },
    ]),
  ],
  chinese: [
    single("rice", "Base", true, [
      { id: "steamed", label: "Steamed rice", delta: 0 },
      { id: "fried", label: "Fried rice", delta: 1.5 },
      { id: "noodles", label: "Noodles", delta: 1.5 },
    ]),
    multi("addons", "Add-ons", [
      { id: "spicy", label: "Make it spicy", delta: 0 },
      { id: "egg", label: "Extra egg", delta: 1.0 },
      { id: "veg", label: "Extra veg", delta: 1.25 },
      { id: "protein", label: "Extra protein", delta: 3.0 },
    ]),
  ],
  mediterranean: [
    single("sauce", "Sauce", true, [
      { id: "garlic", label: "Garlic toum", delta: 0 },
      { id: "tahini", label: "Tahini", delta: 0 },
      { id: "hot", label: "Hot sauce", delta: 0 },
    ]),
    multi("addons", "Add-ons", [
      { id: "falafel", label: "Extra falafel", delta: 1.5 },
      { id: "feta", label: "Feta", delta: 1.25 },
      { id: "olives", label: "Kalamata olives", delta: 1.0 },
      { id: "fries", label: "Side of fries", delta: 2.5 },
    ]),
  ],
  bbq: [
    single("sauce", "Sauce", true, [
      { id: "classic", label: "Classic", delta: 0 },
      { id: "spicy", label: "Spicy", delta: 0 },
      { id: "carolina", label: "Carolina gold", delta: 0 },
    ]),
    multi("sides", "Extra sides", [
      { id: "slaw", label: "Coleslaw", delta: 2.0 },
      { id: "cornbread", label: "Cornbread", delta: 2.25 },
      { id: "mac", label: "Mac & cheese", delta: 3.0 },
      { id: "beans", label: "Smoked beans", delta: 2.5 },
    ]),
  ],
  seafood: [
    single("prep", "Preparation", true, [
      { id: "fried", label: "Fried", delta: 0 },
      { id: "grilled", label: "Grilled", delta: 0 },
    ]),
    multi("addons", "Add-ons", [
      { id: "tartar", label: "Extra tartar", delta: 0.75 },
      { id: "lemon", label: "Lemon butter", delta: 1.0 },
      { id: "cajun", label: "Cajun dusting", delta: 0.5 },
      { id: "fries", label: "Side of fries", delta: 2.5 },
    ]),
  ],
  breakfast: [
    single("eggs", "Eggs", true, [
      { id: "scrambled", label: "Scrambled", delta: 0 },
      { id: "poached", label: "Poached", delta: 0 },
      { id: "fried", label: "Fried", delta: 0 },
    ]),
    multi("addons", "Add-ons", [
      { id: "bacon", label: "Smoked bacon", delta: 2.0 },
      { id: "avocado", label: "Avocado", delta: 1.5 },
      { id: "extraegg", label: "Extra egg", delta: 1.25 },
      { id: "maple", label: "Extra maple", delta: 0.5 },
    ]),
  ],
  steak: [
    single("doneness", "Doneness", true, [
      { id: "rare", label: "Rare", delta: 0 },
      { id: "medrare", label: "Medium rare", delta: 0 },
      { id: "medium", label: "Medium", delta: 0 },
      { id: "well", label: "Well done", delta: 0 },
    ]),
    multi("sides", "Sides", [
      { id: "fries", label: "Fries", delta: 0 },
      { id: "mash", label: "Mashed potato", delta: 1.0 },
      { id: "veg", label: "Grilled veg", delta: 1.5 },
      { id: "shrimp", label: "Add garlic shrimp", delta: 5.0 },
    ]),
  ],
  boba: [
    single("sweet", "Sweetness", true, [
      { id: "0", label: "0%", delta: 0 },
      { id: "50", label: "50%", delta: 0 },
      { id: "100", label: "100%", delta: 0 },
    ]),
    single("ice", "Ice", true, [
      { id: "regular", label: "Regular ice", delta: 0 },
      { id: "less", label: "Less ice", delta: 0 },
      { id: "none", label: "No ice", delta: 0 },
    ]),
    multi("toppings", "Toppings", [
      { id: "boba", label: "Extra boba", delta: 0.75 },
      { id: "pudding", label: "Egg pudding", delta: 0.75 },
      { id: "jelly", label: "Grass jelly", delta: 0.75 },
      { id: "cream", label: "Cheese foam", delta: 1.25 },
    ]),
  ],
};

const DEFAULT_GROUPS: OptionGroup[] = [
  single("size", "Size", true, [
    { id: "regular", label: "Regular", delta: 0 },
    { id: "large", label: "Large", delta: 2.0 },
  ]),
  multi("addons", "Make it better", [
    { id: "extra", label: "Extra portion", delta: 2.5 },
    { id: "side", label: "Add a side", delta: 3.0 },
  ]),
];

export function optionGroupsFor(restaurant: Restaurant, _item: MenuItem): OptionGroup[] {
  const tag = restaurant.tags[0];
  return GROUPS[tag] ?? DEFAULT_GROUPS;
}
