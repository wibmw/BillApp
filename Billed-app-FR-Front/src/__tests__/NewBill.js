/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from '@testing-library/dom'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import mockStore from '../__mocks__/store'
import router from '../app/Router'
import { ROUTES, ROUTES_PATH } from '../constants/routes'
import NewBill from '../containers/NewBill'
import NewBillUI from '../views/NewBillUI'
import store from '../app/store'

// It is working only if we import mockStore BEFORE router.
jest.mock('../app/store', () => mockStore)

function onNavigate(pathname) {
  document.body.innerHTML = ROUTES({ pathname })
}

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    test('Then mail icon in vertical layout should be highlighted', () => {
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      const root = document.createElement('div')
      root.setAttribute('id', 'root')
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)

      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon.classList.contains('active-icon')).toBeTruthy()
    })
  })

  describe('When I select a file', () => {
    test('Then the file type is checked on change', () => {
        window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
        document.body.innerHTML = NewBillUI()

      const newBill = new NewBill({ document, onNavigate, store, localStorage: window.localStorage })
      const imgMock = new File(['(⌐□_□)'], 'file.jpg', { type: 'image/jpg' })
      const badImgMock = new File(['(⌐□_□)'], 'file.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByTestId('file')
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))

      fileInput.addEventListener('change', handleChangeFile)
      fireEvent.change(fileInput, { target: { files: [imgMock] } })
      expect(handleChangeFile).not.toHaveReturnedWith(true)

      fireEvent.change(fileInput, { target: { files: [badImgMock] } })
      expect(handleChangeFile).toHaveReturnedWith(false)
      expect(handleChangeFile).toHaveBeenCalled()

    })
  })
  describe('When I fill the form', () => {
  test('creating a new bill redirects me to the bills page', async () => {
    jest.spyOn(store, 'bills')
    jest.spyOn(store.bills(), 'create')

    const imgMock = new File(['(⌐□_□)'], 'file.jpg', { type: 'image/jpg' })

    const expectedPostData = [
      ['type', 'Equipement et matériel'],
      ['name', 'Test 1'],
      ['date', '2022-06-25'],
      ['amount', '650'],
      ['vat', '50'],
      ['pct', '20'],
      ['commentary', 'Test 1 Commentary'],
      ['file', expect.objectContaining({name: 'file.jpg', size: imgMock.size, type: 'image/jpg'})],
      ['email', 'a@a'],
      ['status', 'pending'],
    ]

    const expectedPostResponse = {fileUrl: 'https://localhost:3456/images/test.jpg', key: '1234'}
    window.onNavigate(ROUTES_PATH.Bills)
    window.localStorage.setItem('user', JSON.stringify({type: 'Employee', email: 'a@a',}))
    document.body.innerHTML = NewBillUI()
    new NewBill({ document, onNavigate, store, localStorage: window.localStorage })

    const form = {
      type: screen.getByTestId('expense-type'),
      name: screen.getByTestId('expense-name'),
      date: screen.getByTestId('datepicker'),
      amount: screen.getByTestId('amount'),
      vat: screen.getByTestId('vat'),
      pct: screen.getByTestId('pct'),
      commentary: screen.getByTestId('commentary'),
      file: screen.getByTestId('file'),
      submit: screen.getByText('Envoyer'),
    }

    fireEvent.change(form.type, { target: { selectedIndex: 5 } })
    userEvent.type(form.name, 'Test 1')
    fireEvent.change(form.date, { target: { value: '2022-06-25' } })
    userEvent.type(form.amount, '650')
    userEvent.type(form.vat, '50')
    userEvent.type(form.pct, '20')
    userEvent.type(form.commentary, 'Test 1 Commentary')

    fireEvent.change(form.file, { target: { files: [imgMock] } })
    fireEvent.click(form.submit)

    expect(window.location.pathname).toBe('/')
    expect(window.location.hash).toBe(ROUTES_PATH.Bills)

    expect(store.bills).toHaveBeenCalled()
    expect(store.bills().create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.any(FormData),
        headers: expect.objectContaining({
          noContentType: true,
        }),
      })
    )

    // Check POST request data.
    const formData = Array.from(store.bills().create.mock.calls[0][0].data)
    expect(formData).toHaveLength(expectedPostData.length)
    expect(formData).toEqual(expect.arrayContaining(expectedPostData))

    // Check POST response.
    expect(store.bills().create).toHaveReturnedWith(expect.any(Promise))
    expect(await store.bills().create.mock.results[0].value).toEqual(expectedPostResponse)
  })
})
})
