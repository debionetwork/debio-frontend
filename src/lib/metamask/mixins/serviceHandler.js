
export default {
  data: () => ({
    isLoading: false,
    isErrors: null 
  }),

  computed: {
    loadingPlaceholder() {
      return this.isLoading ? "Loading Data..." : ""
    }
  },

  methods: {
    /**
     * Dispatch wrapper that marks the action as loading & parses errors
     * @param action
     * @param args
     * @returns {Promise<*>}
     */
    async dispatch(action, ...args) {
      this.isLoading = true
      try {
        const response = await action.apply(this, args)
        
        return Promise.resolve(response)
      } catch (error) {
        this.isErrors = error

        console.error(`[${error?.response?.status}] Something went wrong, Please try again later!`)

        return Promise.reject(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
