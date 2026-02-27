import categories from '../data/categories.json';
import categoryMap from '../data/categories-map.json';

/**
 * Gets the category hierarchy tree.
 */
export function getCategoryTree() {
    return categories;
}

/**
 * Gets a specific category by its ID.
 * @param {number|string} id 
 */
export function getCategoryById(id) {
    return categoryMap[id.toString()] || null;
}

/**
 * Gets sub-categories for a given parent category ID.
 * @param {number|string} parentId 
 */
export function getSubCategories(parentId) {
    const category = getCategoryById(parentId);
    return category ? category.children : [];
}

/**
 * Gets a category by its slug or name-based ID.
 * @param {string} slugOrId 
 */
export function getCategoryBySlug(slug) {
    return Object.values(categoryMap).find(cat => cat.slug === slug) || null;
}
