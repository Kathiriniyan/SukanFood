import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminOverview from './pages/AdminOverview'
import OrderPick from './pages/OrderPick'
import PickListDetail from './pages/PickListDetail'
import Quotation from './pages/quotation'
import AddQuotation from './pages/AddQuotation'
import CountingCreate from './pages/CountingCreate'
import PurchaseOrder from './pages/PurchaseOrder'
import PurchaseOrderDetail from './pages/PurchaseOrderDetail'
import CreateUser from './pages/CreateUser'
import UserList from './pages/UserList'
import OverviewEvening from './pages/OverviewEvening'
import Error from './pages/Error'
import EditUser from './pages/EditUser'
import EveningDetail from './pages/EveningDetail'
import QuotationDetail from './pages/QuotationDetail'
import PickListArchive from './pages/PickListArchive'
import SalesOrder from './pages/SalesOrder'
import SalesOrderDetail from './pages/SalesOrderDetail'
import CreateSupplierQuotation from './pages/CreateSupplierQuotation'
import PurchaseQuotationDashboard from './pages/PurchaseQuotationDashboard'
import PreviewSupplierQuotation from './pages/PreviewSupplierQuotation'
import PurchaseQuotationDetail from './pages/PurchaseQuotationDetail'
import PurchaseQuotationEdit from './pages/PurchaseQuotationEdit'
import Login from './components/Auth/Login'
import AddAddress from './pages/AddAddress'
import AddSalesOrder from './pages/AddSalesOrder'
import AddCustomer from './pages/AddCustomer'
import StockDashboard from './pages/StockDashboard'
import AddItem from './pages/AddItem'
import ItemDetail from './pages/ItemDetail'


const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<AdminOverview/>} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/sales/order-pick' element={<OrderPick/>}/>
        <Route path="/sales/order-pick/:pickListId" element={<PickListDetail/>} />
        <Route path='/sales/quotation' element={<Quotation/>}/>
        <Route path='/sales/add-customer' element={<AddCustomer/>}/>
        <Route path="/sales/quotation/quotation-detail/:quotationNo" element={<QuotationDetail/>} />
        <Route path='/sales/quotation/add-quotation' element={<AddQuotation/>}/>
        <Route path='/sales/quotation/add-address' element={<AddAddress/>}/>
        <Route path="/sales/picklist-archive" element={<PickListArchive/>}/>
        <Route path='/sales/sales-order' element={<SalesOrder/>}/>
        <Route path='/sales/sales-order/add-sales-order' element={<AddSalesOrder/>}/>
        <Route path="/sales/sales-order/:orderId" element={<SalesOrderDetail/>}/>


        <Route path='/counting/create' element={<CountingCreate/>}/>
        <Route path="/purchase/receipt-dashboard" element={<PurchaseOrder />} />
        <Route path="/purchase/receipt-dashboard/:purchaseReceiptId" element={<PurchaseOrderDetail />} />
        <Route path='/purchase/create-supplier-quotation' element={<CreateSupplierQuotation/>} />
        <Route path='/purchase/quotation-dashboard' element={<PurchaseQuotationDashboard/>} />
        <Route path='/purchase/preview-supplier-quotation' element={<PreviewSupplierQuotation />} />
        <Route path="/purchase/quotation-dashboard/purchaseQuotationDetail/:id" element={<PurchaseQuotationDetail />} />
        <Route path="/purchase/quotation-dashboard/purchaseQuotationDetail/:id/edit" element={<PurchaseQuotationEdit/>} />
        

        <Route path='/user/create-user' element={<CreateUser/>}/>
        <Route path='/user/user-list' element={<UserList/>}/>
        <Route path='/user/edit-user/:userId'element={<EditUser/>}/>


        <Route path='/stock/dashboard'element={<StockDashboard/>}/>
        <Route path='/stock/:id'element={<ItemDetail/>}/>
        <Route path='/stock/create-item'element={<AddItem/>}/>
        {/* <Route path='/stock/dashboard'element={<EditUser/>}/> */}

        <Route path='/overview/overview-evening' element={<OverviewEvening/>}/>
        <Route path='/overview/overview-evening/:eveningId' element={<EveningDetail />}/>

        <Route path="*" element={<Error/>} />
      </Routes>
    </div>
  )
}

export default App