// ** Types
import { NavGroup, NavLink } from "../../@core/layouts/types";

/**
 * Check for URL queries as well for matching
 * Current URL & Item Path
 *
 * @param item
 * @param activeItem
 */
export const handleURLQueries = (
  location: any,
  path: string | undefined
): boolean => {
  if (Object.keys(location.search).length && path) {
    const arr = Object.keys(location.search);

    return (
      location.pathname.includes(path) &&
      location.pathname.includes(location.search[arr[0]] as string) &&
      path !== "/"
    );
  }

  return false;
};

/**
 * Check if the given item has the given url
 * in one of its children
 *
 * @param item
 * @param currentURL
 */
export const hasActiveChild = (item: NavGroup, currentURL: string): boolean => {
  const { children } = item;

  if (!children) {
    return false;
  }

  for (const child of children) {
    if ((child as NavGroup).children) {
      //@ts-ignore
      if (hasActiveChild(child, currentURL)) {
        return true;
      }
    }
    const childPath = (child as NavLink).path;

    // Check if the child has a link and is active
    if (
      child &&
      childPath &&
      currentURL &&
      (childPath === currentURL ||
        (currentURL.includes(childPath) && childPath !== "/"))
    ) {
      return true;
    }
  }

  return false;
};

/**
 * Check if this is a children
 * of the given item
 *
 * @param children
 * @param openGroup
 * @param currentActiveGroup
 */
export const removeChildren = (
  children: NavLink[],
  openGroup: string[],
  currentActiveGroup: string[]
) => {
  children.forEach((child: NavLink) => {
    if (!currentActiveGroup.includes(child.title)) {
      const index = openGroup.indexOf(child.title);
      if (index > -1) openGroup.splice(index, 1);

      // @ts-ignore
      if (child.children)
      //@ts-ignore
        removeChildren(child.children, openGroup, currentActiveGroup);
    }
  });
};
