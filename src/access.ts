/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: { is_admin?: boolean } } = {}) {
  const { currentUser } = initialState;
  return {
    routeFilter: (route: any) => {
      if (currentUser?.is_admin) {
        return true;
      }
      // @ts-ignore
      const menu = currentUser?.menu ?? {};
      return (
        typeof route?.code === 'string' && Object.prototype.hasOwnProperty.call(menu, route.code)
      );
    },
    elementFilter: (code: string) => {
      if (currentUser?.is_admin) {
        return true;
      }
      // @ts-ignore
      const element = currentUser?.element ?? {};
      return Object.prototype.hasOwnProperty.call(element, code);
    },
  };
}
