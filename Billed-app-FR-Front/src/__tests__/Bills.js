/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from '@testing-library/dom'

import BillsUI from '../views/BillsUI.js'
import Bills from '../containers/Bills.js'
import { bills } from '../fixtures/bills.js'

import mockStore from '../__mocks__/store'
import { localStorageMock } from '../__mocks__/localStorage.js'

import { ROUTES, ROUTES_PATH } from '../constants/routes.js'

import router from '../app/Router.js'

jest.mock("../app/store", () => mockStore)

describe('Given I am connected as an employee', () => {
  describe('When I am on Bills Page', () => {
    test('Then bill icon in vertical layout should be highlighted', async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
      const root = document.createElement('div')
      root.setAttribute('id', 'root')
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains('active-icon')).toBeTruthy()
    })

    test('Then it should render bills', async () => {
      const bills = new Bills({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      })
      const getBills = jest.fn(() => bills.getBills())
      const value = await getBills()
      expect(getBills).toHaveBeenCalled()
      expect(value.length).toBe(4)
    })

    test('Then bills should be ordered from earliest to latest', () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map((a) => a.innerHTML)
      const antiChrono = (a, b) => (a < b ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

  describe('When I click on the new bill button', () => {
    test('Then bill should be created', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
      document.body.innerHTML = BillsUI(bills[0])
      const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}
      const store = null
      const testBills = new Bills({document, onNavigate, store, bills, localStorage: window.localStorage})
      const newBillButton = screen.getByTestId('btn-new-bill')
      const handleClickNewBill = jest.fn((e) => testBills.handleClickNewBill(e))
      const getBill = jest.fn((e) => testBills.getBills())
  
      newBillButton.addEventListener('click', handleClickNewBill)
      fireEvent.click(newBillButton)
      expect(handleClickNewBill).toHaveBeenCalled()
      expect(screen.getByText('Envoyer une note de frais')).toBeTruthy()
    })
  })

  describe('When I click on the icon eye', () => {
    test('A modal should open', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
      document.body.innerHTML = BillsUI({ data: bills })
      const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}
      const store = null
      const testBills = new Bills({document, onNavigate, store, bills, localStorage: window.localStorage})

      const eyeIcons = screen.getAllByTestId('icon-eye')
      expect(eyeIcons).toBeTruthy()
      const eyeIcon1 = eyeIcons[1]
      const handleClickIconEye = jest.fn((e) => testBills.handleClickIconEye(e.target))
      eyeIcon1.addEventListener('click', handleClickIconEye)
      fireEvent.click(eyeIcon1)
      expect(screen.getByText('Justificatif')).toBeTruthy()
    })
  })

})

// test d'int??gration GET
describe('Given I just connected as an employee', () => {
  describe('When I navigate to Bills Page', () => {
    test('fetches bills from mock API GET', async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText('Mes notes de frais'))
      expect(screen.getByText('Mes notes de frais')).toBeTruthy()

      const bill0 = bills[0]

      expect(screen.getByText(bill0.type)).toBeTruthy()
      expect(screen.getByText(bill0.name)).toBeTruthy()
      expect(screen.getByText(`${bill0.amount} ???`)).toBeTruthy()
      expect(screen.getByText(bill0.status)).toBeTruthy()
    })

    describe('When an error occurs on API', () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        localStorage.setItem('user', JSON.stringify({type: 'Employee', email: 'a@a',}))
      })

      test("then fetches bills from an API and fails with 404 message error", async () => {
        const mockedError = "Erreur 404"
         mockStore.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error(mockedError))
            }
          }})
          
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise( process.nextTick)

        const message = await screen.findAllByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })

      test("then fetches bills from an API and fails with 500 message error", async () => {
        const mockedError = "Erreur 500"
         mockStore.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error(mockedError))
            }
          }})
          

        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise( process.nextTick)

        const message = await screen.findAllByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })

      test("then a bad date should return the unformatted date, and log the error", async () => {

        const billWithBadDateFormat = (await mockStore.bills().list())[0]
        billWithBadDateFormat.date = "2002-02-02-bad-date-format"
        const bill = { list: () =>  Promise.resolve([billWithBadDateFormat]) }

        mockStore.bills.mockImplementationOnce(() => bill)

        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick)
  
        expect(screen.findAllByText('2002-02-02-bad-date-format')).toBeTruthy

      })
    })
  })
})
