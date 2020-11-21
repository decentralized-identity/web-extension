
export default {
  icon: 'fas fa-route',
  views: {
    listItem(vc, options){
      return {
        body: `Trip ${ vc.credentialSubject.name ? ' - ' + vc.credentialSubject.name : '' }`
      };
    },
    card(vc, options){
      let data = vc.credentialSubject;
      return {
        title: `Trip ${ data.name ? ' - ' + data.name : '' }`,
        subtitle: vc.subtitle,
        description: data.description,
        body: 
          `<header>Itinerary</header>
          <dl>
            ${
              !data.itinerary ? '' :
              data.itinerary.map(item => 
                `<dt>${ item.name || ''}</dt><dd>${ item.description || '' }</dd>`
              ).join('')
            }
          </dl>`
      }
    }
  }
}