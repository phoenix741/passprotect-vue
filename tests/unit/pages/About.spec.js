import { shallowMount } from '@vue/test-utils'
import About from '@/pages/About'

describe('About.vue', () => {
  it('should render correct contents', () => {
    const wrapper = shallowMount(About, {})
    expect(wrapper.vm.$el.querySelector('.header').textContent).toEqual('about.title')
  })
})
