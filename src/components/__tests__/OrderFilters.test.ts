import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import OrderFilters from '@/components/orders/OrderFilters.vue'
import { ref } from 'vue'

const global = {
  plugins: [PrimeVue] as any,
}

function createFilters() {
  return ref({ status: 'todos', q: '' })
}

describe('OrderFilters', () => {
  it('renderiza el input de búsqueda', () => {
    const filters = createFilters()
    const wrapper = mount(OrderFilters, {
      props: { modelValue: filters.value, 'onUpdate:modelValue': (v: any) => { filters.value = v } },
      global,
    })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('renderiza el selector de estado', () => {
    const filters = createFilters()
    const wrapper = mount(OrderFilters, {
      props: { modelValue: filters.value, 'onUpdate:modelValue': (v: any) => { filters.value = v } },
      global,
    })
    expect(wrapper.findComponent({ name: 'Select' }).exists()).toBe(true)
  })

  it('actualiza el v-model cuando se escribe en el input', async () => {
    const filters = createFilters()
    const wrapper = mount(OrderFilters, {
      props: {
        modelValue: filters.value,
        'onUpdate:modelValue': (v: any) => { filters.value = v },
      },
      global,
    })
    const input = wrapper.find('input')
    await input.setValue('Proveedor SAS')
    expect(filters.value.q).toBe('Proveedor SAS')
  })
})
