<template>
  <uk-flex class="chase_modifier">
    <uk-widget :header="{ title: 'Chase' }">
      <uk-flex
        :gap="8"
        col
        class="chase_settings"
      >
        <uk-flex :gap="8">
          <uk-txt-input
            v-model="chase.name"
            label="Name"
          />
          <uk-num-input
            v-model="chase.duration"
            style="width: 70px"
            :min="1"
            :max="99"
            label="Duration"
          />
        </uk-flex>
        <uk-select-input
          label="Color"
          :model-value="0"
          :options="colorOptions"
        />
        <uk-flex :gap="8">
          <uk-select-input
            v-model="chase.quantize"
            label="Quantize"
            :options="quantizeOptions"
          />
          <uk-select-input
            v-model="chase.trigger"
            class="field"
            label="Trigger"
            :options="triggerOptions"
          />
        </uk-flex>
      </uk-flex>
    </uk-widget>
    <widget-pool-timeline
      v-show="group.cuePool.cues.length"
      :pool="chase"
    />
  </uk-flex>
</template>

<script>
import colorMixin from '@/views/mixins/color.mixin';
import WidgetPoolTimeline from './_widgets/chase.modifier.widget.timeline.vue';

export default {
  name: 'ChaseModifierFragment',
  compatConfig: {
    // or, for full vue 3 compat in this component:
    MODE: 3,
  },
  components: {
    WidgetPoolTimeline,
  },
  mixins: [colorMixin],
  data() {
    return {
      /**
       * Handle to the selected group instance
       */
      group: this.$show.groupPool.getFromId(this.$route.params.groupId),
      /**
       * Handle to the group's selected chase instance
       */
      chase: this.$show.groupPool.getFromId(this.$route.params.groupId).chasePool.getFromId(this.$route.params.chaseId),
      /**
       * Chase trigger options
       * @todo this should be static/hardcoded
       */
      triggerOptions: ['Toggle', 'One Shot'],
      /**
       * Chase triquantization options
       * @todo this should be static/hardcoded
       */
      quantizeOptions: ['None', '1/8', '1/4', '1/2', '1/1'],
    };
  },
  watch: {
    '$route.params.chaseId': function () {
      this.fetchChaseData();
    },
    '$route.params.groupId': function () {
      this.fetchChaseData();
    },
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.keydownHandler);
  },
  mounted() {
    this.fetchChaseData();
  },
  methods: {
    /**
     * Fetch group and chase data from route groupId and chaseId parameters
     *
       * @public
     */
    fetchChaseData() {
      window.removeEventListener('keydown', this.keydownHandler);
      if (this.$route.params.chaseId != null && this.$route.params.groupId != null) {
        this.group = this.$show.groupPool.getFromId(this.$route.params.groupId);
        this.chase = this.$show.groupPool.getFromId(this.$route.params.groupId).chasePool.getFromId(this.$route.params.chaseId);
        window.addEventListener('keydown', this.keydownHandler);
      }
    },
    /**
     * Keydown handler used to handle chase deletion on del/backspace hit
     *
       * @public
     * @param {Object} e keydown event
     */
    keydownHandler(e) {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        this.group.chasePool.delete(this.chase);
        this.$router.push(`/group/${this.$route.params.groupId}`).catch(() => {});
      }
    },
  },
};
</script>

<style scoped>
.chase_modifier {
  width: 100%;
  height: 100%;
}
.chase_settings {
  height: 100%;
  width: 200px;
  padding: 10px;
}
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
}
.field_label {
  margin-bottom: 8px;
}
</style>
