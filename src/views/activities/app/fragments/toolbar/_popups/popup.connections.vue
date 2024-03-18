<template>
  <uk-popup
    v-model="state"
    :movable="true"
    backdrop
    :header="headerData"
    @submit="
      updateOutputs();
      close();
    "
    @input="update()"
  >
    <div class="body">
      <uk-list
        toggleable
        :items="outputs"
        @toggle="selectIface"
      />
      <uk-button
        style="margin: 16px"
        :square="true"
        label="refresh"
        @click="updateOutputs"
      />
    </div>
  </uk-popup>
</template>

<script>

import PopupMixin from '@/views/mixins/popup.mixin.js';

export default {
  name: 'UkPopupConnections',
  mixins: [PopupMixin],
  compatConfig: {
    // or, for full vue 3 compat in this component:
    MODE: 3,
  },
  props: {
    value: Boolean,
  },
  data() {
    return {
      /**
       * Popup header data
       */
      headerData: {
        title: 'Outputs',
      },
      outputs: [],
    };
  },
  mounted() {
    this.updateOutputs();
  },
  methods: {
    update() {
      this.$emit('input', this.state);
      if (this.state) {
        this.updateOutputs();
      }
    },
    // close() {
    //   this.state = false;
    // },
    selectIface(outputs) {
      this.$show.setOutputs(
        outputs.map((o) => this.$show.outputs[o.id]),
      );
    },
    updateOutputs() {
      this.outputs = this.$show.outputs.map((output, i) => {
        const oDeepCpy = JSON.parse(JSON.stringify(output));
        return Object.assign(oDeepCpy, {
          id: i,
          name: `${output.name} - ${output.cidr.split('/')[0]}`,
          more: 'Artnet',
          active: this.$show.selectedOutputs.length ? this.$show.selectedOutputs.some((v) => v.name === output.name) : false,
        });
      });
    },
  },
};
</script>

<style scoped>
.body {
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 300px;
  padding: 0px !important;
}
.subtitle {
  font-family: Roboto-Regular;
  margin-bottom: 8px;
  color: var(--secondary-lighter-alt);
}
.title_icon {
  fill: var(--secondary-lighter);
}
h4 {
  margin-bottom: 4px;
}
</style>
