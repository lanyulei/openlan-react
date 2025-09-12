/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(
  initialState: { currentUser?: { is_admin?: boolean }; hasRoutes?: string[] } = {},
) {
  const { currentUser, hasRoutes = [] } = initialState;
  return {
    routeFilter: (route: any) => {
      if (currentUser?.is_admin) {
        return true;
      }
      return hasRoutes.includes(route.code);
    },
  };
}
