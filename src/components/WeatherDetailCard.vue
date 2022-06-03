<template>
  <div
    class="float-left relative flex flex-col grow p-2 w-24 h-full rounded-3xl text-center bg-custom-dark-gunmetal"
  >
    <span class="mt-3 text-md text-white"><slot name="title"></slot></span>
    <span class="mt-auto mb-4 text-3xl text-white font-semibold"
      ><slot name="value"></slot
    ></span>
    <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-12 h-12">
      <slot name="icon"></slot>
    </div>
  </div>
  <!-- <div
    class="relative w-36 h-36 p-3 bg-slate-300 rounded-md"
    :class="{ 'w-40': isTwoValues }"
  >
    <template v-if="isOneValue">
      <div class="float-left flex flex-col w-3/4">
        <span class="text-md text-slate-800"><slot name="title"></slot></span>
        <span class="text-3xl mt-3 font-semibold"
          ><slot name="value"></slot
        ></span>
      </div>
    </template>

    <template v-if="isTwoValues">
      <div class="float-left flex flex-col w-full">
        <span class="text-md text-slate-800"><slot name="title"></slot></span>
        <div class="flex mt-3">
          <slot name="firstValue"></slot>
        </div>
        <div class="flex mt-3">
          <slot name="secondValue"></slot>
        </div>
      </div>
    </template>

    <template v-if="isCustom">
      <slot name="layout"></slot>
    </template>
    <div class="absolute right-2 top-1/4 w-1/2 h-1/2 opacity-20">
      <slot name="icon"></slot>
    </div>
  </div> -->
</template>

<script>
export default {
  name: "WeatherDetailCard",
  props: {
    config: String
  }
  // computed: {
  //   isCustom() {
  //     return this.config === "custom";
  //   },
  //   isOneValue() {
  //     return this.config === "oneValue";
  //   },
  //   isTwoValues() {
  //     return this.config === "twoValues";
  //   }
  // }
};
</script>
