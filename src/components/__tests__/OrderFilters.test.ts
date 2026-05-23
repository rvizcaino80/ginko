import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OrderFilters from '@/components/orders/OrderFilters.vue'
import { ref } from 'vue'

function createFilters() {
  return ref({ page: 1, status: 'todos', q: '' })
}

describe('OrderFilters', () => {
  it('renderiza el input de búsqueda', () => {
    const filters = createFilters()
    const wrapper = mount(OrderFilters, { props: { modelValue: filters.value, 'onUpdate:modelValue': (v: any) => filters.value = v } })
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
  })

  it('renderiza el select de estado con la opción "Todos"', () => {
    const filters = createFilters()
    const wrapper = mount(OrderFilters, { props: { modelValue: filters.value, 'onUpdate:modelValue': (v: any) => filters.value = v } })
    const options = wrapper.find('select').findAll('option')
    expect(options[0].text()).toBe('Todos')
  })

  it('renderiza las cuatro opciones de estado más "Todos"', () => {
    const filters = createFilters()
    const wrapper = mount(OrderFilters, { props: { modelValue: filters.value, 'onUpdate:modelValue': (v: any) => filters.value = v } })
    const options = wrapper.find('select').findAll('option')
    expect(options.length).toBe(5)
  })

  it('actualiza el v-model cuando se escribe en el input', async () => {
    const filters = createFilters()
    const wrapper = mount(OrderFilters, {
      props: {
        modelValue: filters.value,
        'onUpdate:modelValue': (v: any) => { filters.value = v },
      },
    })
    const input = wrapper.find('input[type="text"]')
    await input.setValue('Proveedor SAS')
    expect(filters.value.q).toBe('Proveedor SAS')
  })

  it('resetea la página a 1 cuando cambia el filtro', async () => {
    const filters = ref({ page: 3, status: 'todos', q: '' })
    const wrapper = mount(OrderFilters, {
      props: {
        modelValue: filters.value,
        'onUpdate:modelValue': (v: any) => { filters.value = v },
      },
    })
    const input = wrapper.find('input[type="text"]')
    await input.setValue('test')
    expect(filters.value.page).toBe(1)
  })
})
