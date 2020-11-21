
const stripCountryRegex = /^[a-zA-Z]*/;
function toCurrency(num, currency){
  return Number(num).toLocaleString('en-IN', { style: 'currency', currency: currency || 'USD' }).replace(stripCountryRegex, '');
}

export default {
  icon: 'fas fa-receipt',
  views: {
    listItem(vc, options){
      let data = vc.credentialSubject;
      return {
        body: `Invoice ${ data?.broker?.name ? ' - ' + data?.broker?.name : '' }`
      };
    },
    card(vc, options){
      let data = vc.credentialSubject;
      return {
        title: `Invoice ${ data?.broker?.name ? ' - ' + data?.broker?.name : '' }`,
        subtitle: vc.subtitle,
        description: data.description,
        body: 
          `<h3>Items</h3>
          <table>
            ${
              data?.referencesOrder.map(item => `<tr>
                  <td><strong>${ item?.description || '' }</strong></td>
                  <td>${ item?.merchant.name || ''}</td>
                  <td>${toCurrency(item.price, item.priceCurrency)}</td>
                </tr>`
              ).join('') || ''
            }
            <tr>
              <td></td>
              <td>Total:</td>
              <td>${toCurrency(data.totalPaymentDue.price, data.totalPaymentDue.priceCurrency)}</td>
            </tr>
          </table>`
      }
    }
  }
}