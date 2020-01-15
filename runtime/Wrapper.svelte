<script>
  const { Decorator, Component, ...props } = $$props
</script>

<Decorator scoped={props.scoped}>
  <Component {...props}>
    <slot />
  </Component>
</Decorator>
