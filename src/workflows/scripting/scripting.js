'use strict';
(() => {
  // Scripting operations and build state. No DOM, editors, or component layout.
  class Session {
    constructor(provider, onChange = () => {}) {
      this.provider = provider;
      this.onChange = onChange;
      this.cache = new Map();
      this.lastByTarget = new Map();
      this.inFlight = null;
      this.lastKey = null;
      this.changed = new Set();
      this.currentFailure = null;
    }
    get profiles() { return this.provider.profiles; }
    get defaultFiles() { return this.provider.defaultFiles; }
    get DEFAULT_TARGET() { return this.provider.DEFAULT_TARGET; }
    get DEFAULT_COMPILER() { return this.provider.DEFAULT_COMPILER; }
    get pending() { return !!this.inFlight; }
    identity(input) { return JSON.stringify(input); }
    result(key) { return this.cache.get(key); }
    previous(target) { return this.lastByTarget.get(target); }
    image(key) {
      const result = this.result(key);
      if (!result) return null;
      return {
        imageId: result.fingerprint, profileId: result.profileId, target: result.target,
        compiler: result.compiler, optimization: result.optimization,
        byteCount: result.image.byteCount, hex: result.outputs.hex,
        bytes: result.image.bytes.map(({ address, value }) => ({ address, value }))
      };
    }
    busy(key) { return this.inFlight?.key === key; }
    failure(key) { return this.currentFailure?.key === key ? this.currentFailure : null; }
    clearFailure() { this.currentFailure = null; }
    recordFailure(key, result) { this.currentFailure = { ...result, key }; }
    getCompilers(target) { return this.provider.getCompilers(target); }

    accept(result, key) {
      if (this.lastKey === key) return;
      const previous = this.lastByTarget.get(result.profileId);
      const before = new Map(previous?.image.bytes.map(item => [item.address, item.value]) || []);
      const after = new Map(result.image.bytes.map(item => [item.address, item.value]));
      const changed = new Set();
      if (previous) {
        for (const [address, value] of after) if (!before.has(address) || before.get(address) !== value) changed.add(address);
        for (const address of before.keys()) if (!after.has(address)) changed.add(address);
      }
      this.changed = changed;
      this.lastByTarget.set(result.profileId, result);
      this.lastKey = key;
    }

    async obtain(input, key = this.identity(input), isCurrent = () => true) {
      const cached = this.result(key);
      if (cached) return cached;
      if (this.inFlight) {
        const running = this.inFlight;
        if (running.key === key) return running.promise;
        await running.promise.catch(() => {});
        // A component supplies relevance, without exposing its DOM to this workflow.
        if (!isCurrent()) return null;
        return this.obtain(input, key, isCurrent);
      }
      const job = { key, promise: null };
      this.inFlight = job;
      job.promise = (async () => {
        try {
          const result = await this.provider.buildProject(input);
          if (result.ok) this.cache.set(key, result);
          return result;
        } finally {
          if (this.inFlight === job) this.inFlight = null;
        }
      })();
      this.onChange();
      return job.promise;
    }
  }
  window.ChipOpenboxScripting = { Session };
})();
