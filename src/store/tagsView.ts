import { defineStore } from 'pinia';
import { TagsViewState } from './storeType';

const UseTagsViewStore = defineStore('tagsViewStore', {
  state: (): TagsViewState => {
    return { visitedViews: [], cachedViews: [] };
  },
  actions: {
    addVisitedView(view: Record<string, any>) {
      if (this.visitedViews.some(v => v.path === view.path)) return;
      this.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta.title || 'no-name'
        })
      );
    },
    addCachedView(view: Record<string, any>) {
      if (this.cachedViews.includes(view.name)) return;
      if (!view.meta.noCache) {
        this.cachedViews.push(view.name);
      }
    },
    addView(view: Record<string, any>) {
      this.addCachedView(view);
      this.addVisitedView(view);
    },

    delVisitedView(view: Record<string, any>) {
      for (const [i, v] of this.visitedViews.entries()) {
        if (v.path === view.path) {
          this.visitedViews.splice(i, 1);
          break;
        }
      }
    },
    delCachedView(view: Record<string, any>) {
      const index = this.cachedViews.indexOf(view.name);
      index > -1 && this.cachedViews.splice(index, 1);
    },
    delView(view: Record<string, any>) {
      this.addCachedView(view);
      this.addVisitedView(view);
    },

    delOthersVisitedViews(view: Record<string, any>) {
      this.visitedViews = this.visitedViews.filter(v => {
        return v.meta.affix || v.path === view.path;
      });
    },
    delOthersCachedViews(view: Record<string, any>) {
      const index = this.cachedViews.indexOf(view.name);
      if (index > -1) {
        this.cachedViews = this.cachedViews.slice(index, index + 1);
      } else {
        // if index = -1, there is no cached tags
        this.cachedViews = [];
      }
    },
    delOthersViews(view: Record<string, any>) {
      this.delOthersVisitedViews(view);
      this.delOthersCachedViews(view);
    },

    delAllVisitedViews() {
      // keep affix tags
      const affixTags = this.visitedViews.filter(tag => tag.meta.affix);
      this.visitedViews = affixTags;
    },
    delAllCachedViews() {
      this.cachedViews = [];
    },
    delAllViews() {
      this.delAllVisitedViews();
      this.delAllCachedViews();
    },

    updateVisitedView(view: Record<string, any>) {
      for (let v of this.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view);
          break;
        }
      }
    }
  }
});

export default UseTagsViewStore;
