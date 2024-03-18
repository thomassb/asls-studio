<template>
  <uk-popup
    v-model="state"
    :header="headerData"
    @submit="create()"
    @input="update()"
  >
    <uk-flex class="group_popup">
      <uk-flex>
        <uk-list
          class="fixture_list"
          :items="universes"
          colored
          toggleable
          filterable
          no-highlight
          @toggle="setFixtureList"
        />
      </uk-flex>
      <uk-flex col>
        <uk-flex
          style="padding: 10px"
          col
          :gap="8"
        >
          <uk-txt-input
            v-model="name"
            label="Name"
          />
          <uk-select-input
            label="Color"
            :options="colorOptions"
            :model-value="getIndexFromColor(color)"
            @input="setGroupColor"
          />
        </uk-flex>
      </uk-flex>
    </uk-flex>
  </uk-popup>
</template>

<script>
import colorMixin from '@/views/mixins/color.mixin';
import PopupMixin from '@/views/mixins/popup.mixin.js';

export default {
  name: 'UkPopupGroup',
  compatConfig: {
    // or, for full vue 3 compat in this component:
    MODE: 3,
  },
  mixins: [colorMixin, PopupMixin],
  emits: ['create'],
  data() {
    return {
      /**
       * Popup header data
       */
      headerData: { title: 'Create Group' },
      /**
       * Group name
       */
      name: 'New Group',
      /**
       * Group Color
       */
      color: this.getColorFromIndex(0),
      /**
       * Handle to show universe pool
       */
      universes: this.$show.universePool.listable, // JSON.parse(JSON.stringify(this.$show.universePool.listable)),
      /**
       * List of fixtures selected for grouping
       */
      selectedFixtures: [],
    };
  },
  watch: {
    modelValue(state) {
      if (state) {
        this.init();
      } else {
        this.deinit();
      }
    },
  },
  methods: {
    /**
     * Init popup. Automatically fetches default group name and color.
     *
     * @public
     */
    init() {
      /**
       * Deeply copying listable universe data.
       * Item list would be refreshed  and untoggled on any change operation otherwise
       * @toodo Check this weird behavior. It seems like their is a very weird issue in list reactivity/component dependency ?
       * Anyway, it should do the job for now.
       */
      this.universes = this.$show.universePool.listable;
      const groupId = this.$show.groupPool.genGroupId();
      this.name = `Group ${groupId}`;
      this.color = this.getColorFromIndex(groupId);
      this.selectedFixtures = [];
    },
    /**
     * Associates a color to the group
     *
     * @public
     * @param {Number} colorIndex uikit color index
     */
    setGroupColor(colorIndex) {
      this.color = this.getColorFromIndex(colorIndex);
    },
    /**
     * Fetch and the list of fixtures selected for grouping
     *
     * @public
     * @param {Array} fixturesData array of fixture objects
     */
    setFixtureList(fixturesData) {
      /**
       * Force clearing selected fixtures appearance on toggled data change
       */
      if (this.selectedFixtures.length) {
        this.selectedFixtures[0].highlightSingle(false, true);
      }
      this.selectedFixtures = fixturesData.map((fixture, index) => {
        const fxt = this.$show.fixturePool.getFromId(fixture.id);
        index ? fxt.highlight(true, true) : fxt.highlightSingle(true, true);
        return fxt;
      });
    },
    /**
     * Create new group
     *
     * @public
     */
    create() {
      const group = this.$show.groupPool.addRaw({
        color: this.color,
        name: this.name,
      });
      this.selectedFixtures.forEach((fixture) => {
        group.addFixture(fixture);
      });
      this.$emit('create', group);
      this.close();
    },
    /**
     * Deinit popup and environment. unselects and unhighlights all selected fixtures.
     * @public
     */
    deinit() {
      if (this.selectedFixtures.length) {
        this.selectedFixtures[0].highlightSingle(false, true);
      }
    },
  },
};
</script>

<style scoped>
.group_popup {
  display: flex;
  flex-direction: row !important;
  height: 100%;
  min-height: 300px;
  max-height: 300px;
}
.fixture_list {
  height: 100%;
  width: 300px;
  border-right: 1px solid var(--primary-dark);
}
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
  margin-right: 8px;
  width: 55px;
}
.field_label {
  margin-bottom: 8px;
}
.form_validation {
  width: 100%;
  padding: 8px;
  border-top: 1px solid var(--primary-dark);
}
</style>
