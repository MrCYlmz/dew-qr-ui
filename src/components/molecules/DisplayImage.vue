<script setup lang="ts">
import { computed } from "vue";
import { useFetchImage } from "../../api/user/queries.ts";

const props = defineProps<{
  id: string;
}>();

const { data: imageBlob, isFetched } = useFetchImage(props.id!);
const imageUrl = computed(() =>
  imageBlob.value ? URL.createObjectURL(imageBlob.value) : undefined
);
</script>

<template>
  <v-img :src="isFetched && imageUrl ? imageUrl : undefined" cover> </v-img>
</template>

<style scoped lang="scss">
.v-img {
  height: 154px;
  width: 154px;
  object-fit: cover;
  background-color: var(--v-primary-base);
}
</style>
