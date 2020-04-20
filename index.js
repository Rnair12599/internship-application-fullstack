// Main function that listens for initial request
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// ElementHandler class in HTMLRewriter used to modify elements in html pages

class ElementHandler {
  element(element) {
    if(element.tagName === 'title'){
      console.log(`Incoming element: ${element.tagName}`);
      element.prepend(`Rahul Nair's Full Stack Assignment`);
    }
    else if(element.tagName === 'h1' && (element.getAttribute('id') == "title")  ){
      console.log(`Incoming element: h1#title`);
      element.prepend(`Rahul Nair's`);
      element.append(`Page`);
    }
    else if(element.tagName === 'p' && (element.getAttribute('id') == "description")  ){
      console.log(`Incoming element: p#description`);
      element.setInnerContent(`Rahul Nair's variant page for
       the fullstack internship application at Cloudflare!
       Clear cookies or open page in incognito to encounter the other variant page.`);
    }
    else if(element.tagName === 'a' && (element.getAttribute('id') == "url")  ){
      console.log(`Incoming element: a#urls`);
      element.setAttribute("href", "https://github.com/Rnair12599")
      element.setInnerContent(`Check out Rahul Nair's github!`);
    }
  }

  comments(comment) {
    // An incoming comment
  }

  text(text) {
    // An incoming piece of text

  }
}



// request handler that also fetch's other pages and return response with appropriate html page


async function handleRequest(request) {
  let cookieVal = request.headers.get('cookie');
  console.log(cookieVal);

  const response = await fetch('https://cfw-takehome.developers.workers.dev/api/variants', {
    headers: {
      'Content-Type': 'text/html',
    },
  });

  let urls = await response.json();

  let val = cookieVal;

  if(cookieVal && cookieVal.includes("variant=0") ){
    val = 0;
  }
  else if(cookieVal && cookieVal.includes("variant=1") ){
    val = 1;
  }
  else{
    float = Math.random();
    if(float < 0.5){
      val = 0;
    }
    else{
      val = 1;
    }
  }


  const varResponse = await fetch(urls.variants[val], {
    headers: {
      'Content-Type': 'text/html',
    },
  });


  let htmlrewriter =  new HTMLRewriter()
    .on('title', new ElementHandler())
    .on('h1#title', new ElementHandler())
    .on('p#description', new ElementHandler())
    .on('a#url', new ElementHandler())
    .transform(varResponse);



  newPage = htmlrewriter.body;
  return new Response(newPage, {
    headers: {
      'Content-Type': 'text/html',
      'Set-Cookie' :`variant=${val}`,
    },
  });

}
