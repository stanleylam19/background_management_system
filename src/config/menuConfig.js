const menuList = [
  {
    title: 'Home',
    key: '/home',
    icon: 'home',
    isPublic: true,
  },
  {
    title: 'Products',
    key: '/products',
    icon: 'appstore',
    children: [
      {
        title: 'Category',
        key: '/category',
        icon: 'bars'
      },
      {
        title: 'Product',
        key: '/product',
        icon: 'tool'
      },
    ]
  },

  {
    title: 'User Management',
    key: '/user',
    icon: 'user'
  },
  {
    title: 'Roles Management',
    key: '/role',
    icon: 'safety',
  }
]

export default menuList