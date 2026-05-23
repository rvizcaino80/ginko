import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusBadge from '@/components/shared/StatusBadge.vue'

describe('StatusBadge', () => {
  it('renderiza el estado BORRADOR correctamente', () => {
    const wrapper = mount(StatusBadge, { props: { estado: 'BORRADOR' } })
    expect(wrapper.text()).toContain('Borrador')
  })

  it('renderiza el estado APROBADA correctamente', () => {
    const wrapper = mount(StatusBadge, { props: { estado: 'APROBADA' } })
    expect(wrapper.text()).toContain('Aprobada')
  })

  it('renderiza el estado RECHAZADA correctamente', () => {
    const wrapper = mount(StatusBadge, { props: { estado: 'RECHAZADA' } })
    expect(wrapper.text()).toContain('Rechazada')
  })

  it('renderiza el estado PAGADA correctamente', () => {
    const wrapper = mount(StatusBadge, { props: { estado: 'PAGADA' } })
    expect(wrapper.text()).toContain('Pagada')
  })

  it('aplica las clases de color correspondientes a BORRADOR', () => {
    const wrapper = mount(StatusBadge, { props: { estado: 'BORRADOR' } })
    expect(wrapper.classes()).toContain('bg-gray-100')
  })

  it('aplica las clases de color correspondientes a APROBADA', () => {
    const wrapper = mount(StatusBadge, { props: { estado: 'APROBADA' } })
    expect(wrapper.classes()).toContain('bg-green-100')
  })
})
