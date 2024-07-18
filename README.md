
# Shopify Product Fetcher

This Node.js script fetches products from a Shopify store using the GraphQL API. The script retrieves products based on the provided title, sorts their variants by price, and displays the results. If no products are found, it displays a message indicating that no products were found with the given name.

## Prerequisites

- Node.js installed on your machine
- A Shopify store with access to the Storefront API
- Storefront access token from your Shopify store

## Installation

1. Clone the repository or download the script files.
2. Navigate to the project directory.
3. Install the required dependencies.

```bash
npm install
```

5. Create a `.env` file in the root directory of the project and add your Shopify store URL and access token.

```
SHOPIFY_STORE_URL=https://your-store.myshopify.com/api/2023-04/graphql.json
ACCESS_TOKEN=your-shopify-access-token
```

## Usage

1. Run the script with the desired product name:

```bash
node app.js --name=glove
```

## Script Explanation

1. **Fetch Products by Title**: The function `fetchProductsByTitle` sends a GraphQL request to Shopify's  API to fetch products based on the title/name.

```javascript
async function fetchProductsByTitle(title) {
  const data = JSON.stringify({
    query: GET_PRODUCTS_BY_TITLE,
    variables: { title },
  });

  const response = await fetch(SHOPIFY_STORE_URL, {
    method: 'post',
    body: data,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN,
    },
  });

  const json = await response.json();
  return json.data.products.edges.map(edge => edge.node);
}
```

2. **Display Sorted Variants**: The function `displaySortedVariants` processes the fetched products, sorts the variants by price, and prints the results.

```javascript
function displaySortedVariants(products) {
  const variants = [];
  products.forEach(product => {
    product.variants.edges.forEach(variant => {
      variants.push({
        productTitle: product.title,
        variantTitle: variant.node.title,
        price: parseFloat(variant.node.price.amount),
      });
    });
  });

  variants.sort((a, b) => a.price - b.price);

  variants.forEach(variant => {
    console.log(`${variant.productTitle} - ${variant.variantTitle} - price $${variant.price.toFixed(2)}`);
  });
}
```

3. **Main Function**: The `main` function handles the script's main logic, including checking if the product title/name argument is provided, fetching products, and displaying a message if no products are found.

```javascript
async function main() {
  const productNameArg = process.argv.find(arg => arg.startsWith('--name='));

  if (!productNameArg) {
    console.error('Please provide a product title using --name argument.');
    process.exit(1);
  }

  const productTitle = productNameArg.split('=')[1];

  try {
    const products = await fetchProductsByTitle(productTitle);
    if (products.length === 0) {
      console.log('There are no products with that name, please try another one.');
    } else {
      displaySortedVariants(products);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

main();
```


## License

This project is licensed under the MIT License.
<br>
<br>
<br>
##
<div align="center">
    Created with :heart: by Jhon Garces Montes
</div>