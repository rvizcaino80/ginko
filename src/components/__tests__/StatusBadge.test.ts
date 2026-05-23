import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import StatusBadge from '@/components/shared/StatusBadge.vue'

const global = {
  plugins: [PrimeVue] as any,
}

describe('StatusBadge', () => {
  it('renderiza el estado BORRADOR correctamente', () => {
    const wrapper = mount(StatusBadge, { props: { estado: 'BORRADOR' }, global })
    expect(wrapper.text()).toContain('Borrador')
  })

  it('renderiza el estado APROBADA correctamente', () => {
    const wrapper = mount(StatusBadge, { props: { estado: 'APROBADA' }, global })
    expect(wrapper.text()).toContain('Aprobada')
  })

  it('renderiza el estado RECHAZADA correctamente', () => {
    const wrapper = mount(StatusBadge, { props: { estado: 'RECHAZADA' }, global })
    expect(wrapper.text()).toContain('Rechazada')
  })

  it('renderiza el estado PAGADA correctamente', () => {
    const wrapper = mount(StatusBadge, { props: { estado: 'PAGADA' }, global })
    expect(wrapper.text()).toContain('Pagada')
  })

  it('asigna la severidad warn para BORRADOR', () => {
    const wrapper = mount(StatusBadge, { props: { estado: 'BORRADOR' }, global })
    const tag = wrapper.findComponent({ name: 'Tag' })
    expect(tag.props('severity')).toBe('warn')
  })

  it('asigna la severidad success para APROBADA', () => {
    const wrapper = mount(StatusBadge, { props: { estado: 'APROBADA' }, global })
    const tag = wrapper.findComponent({ name: 'Tag' })
    expect(tag.props('severity')).toBe('success')
  })
})
