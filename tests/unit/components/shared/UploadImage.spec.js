import { shallowMount } from '@vue/test-utils'
import UploadImage from '@/components/shared/UploadImage.vue'

describe('UploadImage.vue', () => {
  it('Test that the component show a progress bar', () => {
    const UploadImageComponent = shallowMount(UploadImage, {
      propsData: {
        value: 'base64'
      }
    })
    expect(UploadImageComponent.element).toMatchSnapshot()
  })
})
