<template>
  <uk-popup @submit="addFixturesToGroup" :valid="selectedFixtures.length > 0" @input="update()" v-model="state" :header="headerData">
    <uk-flex col class="group_patch_popup">
      <uk-list class="fixture_list" :items="availableFixtures" colored toggleable filterable noHighlight @toggle="selectFixtures" />
    </uk-flex>
  </uk-popup>
</template>

<script>
import PopupMixin from "@/views/mixins/popup.mixin.js";

export default {
  name: "ukPopupGroupPatch",
  mixins: [PopupMixin],
  props: {
    /**
     * Handle to group instance
     */
    group: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      /**
       * POpup header data
       */
      headerData: { title: "Add Group Fixture" },
      /**
       * List of available fixtures
       */
      availableFixtures: [],
      /**
       * List of fixtures selected for grouping
       */
      selectedFixtures: [],
    };
  },
  methods: {
    /**
     * Init popup. Fetch available fixture list by comparing available show fixtures
     * with fixtures that are already present in the group. fixtures that are already present are excluded
     * from the selection.
     *
     * @public
     */
    init() {
      this.availableFixtures = [];
      this.selectedFixtures = [];
      this.availableFixtures = this.$show.universePool.listable.map((universe) => {
        return {
          name: universe.name,
          color: universe.color,
          id: universe.id,
          unfold: universe.unfold.flatMap((fixture) => {
            try {
              this.group.fixturePool.getFromId(fixture.id);
              return Object.assign(fixture, { disabled: true });
            } catch (err) {
              return fixture;
            }
          }),
        };
      });
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
    /**
     * Select fixture instances to be added into the group
     *
     * @public
     * @param {Array} fixtures array of fixture definition objects
     */
    selectFixtures(fixtures) {
      /**
       * Force clearing selected fixtures appearance on toggled data change
       */
      if (this.selectedFixtures.length) {
        this.selectedFixtures[0].highlightSingle(false, true);
      }
      this.selectedFixtures = fixtures.map((fixture, index) => {
        let fxt = this.$show.fixturePool.getFromId(fixture.id);
        index ? fxt.highlight(true, true) : fxt.highlightSingle(true, true);
        return fxt;
      });
    },
    /**
     * Add selected fixtures to the group
     *
     * @public
     */
    addFixturesToGroup() {
      this.selectedFixtures.forEach((fixture) => {
        this.group.addFixture(fixture);
      });
      this.close();
    },
  },
  mounted() {
    this.init();
  },
  watch: {
    state(state) {
      if (state) {
        this.init();
      } else {
        this.deinit();
      }
    },
  },
};
</script>

<style scoped>
.group_patch_popup {
  height: 100%;
}
.fixture_list {
  min-height: 350px;
  max-height: 350px;
  flex: 1;
  width: 300px;
  border-right: 1px solid var(--primary-dark);
}
.form_validation {
  width: 100%;
  padding: 8px;
  border-top: 1px solid var(--primary-dark);
}
</style>
