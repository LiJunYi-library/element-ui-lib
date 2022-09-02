<script>
export default {
  name: 'navItem',
  props: {
    route: Object,
  },
  render(h) {
    const vm = this;
    const create = vm._self.create || h;
    if (vm.route.children && vm.route.children.length) {
      return create(
        'el-submenu',
        {key: vm.route.path, attrs: {index: vm.route.path}},
        [
          create('template', {slot: 'title'}, [
            create('i', {class: vm.route.meta.icon}),
            h('span', vm.route.meta.title),
          ]),
          vm.route.children && vm.route.children.length
            ? vm._l(vm.route.children, child => {
                return create('navItem', {
                  key: child.path,
                  attrs: {route: child},
                });
              })
            : vm._e(),
        ],
      );
    }
    return create(
      'el-menu-item',
      {key: vm.route.path, attrs: {index: vm.route.path}},
      [
        create('i', {class: vm.route.meta.icon}),
        h('span', vm.route.meta.title),
      ],
      2,
    );
  },
};
</script>
