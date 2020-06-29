<script>
  const movies = [
    [32, "Fargo"],
    [179, "The Wire"],
    [318, "Community"],
    [5, "True Detective"],
    [532, "Scrubs"],
    [30960, "Cobra Kai"],
    [530, "Seinfeld"],
    [347, "It's Always Sunny in Philadelphia"]
  ];
</script>

<slot scoped={{movies}}>
  <!-- optional fallback -->
</slot>
