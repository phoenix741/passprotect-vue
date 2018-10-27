import Vue from 'vue'
import Hello from '@/pages/About'
import { expect } from 'chai'

describe('About.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Hello)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.header').textContent).to.equal('about.title')
  })
})
