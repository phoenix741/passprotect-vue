import { shallowMount } from '@vue/test-utils'
import Terms from '@/pages/Terms.vue'

describe('About.vue', () => {
  it('should render correct contents', () => {
    const wrapper = shallowMount(Terms, {})
    expect(wrapper.vm.$el.querySelector('.header').textContent).toEqual('terms.title')
  })
})
