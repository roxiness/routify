<script>
  const { Decorator, Component, ...props } = $$props
</script>

<Decorator >
  <Component {...props}>
    <slot />
  </Component>
</Decorator>
