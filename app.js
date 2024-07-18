import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

// GraphQL query to fetch products by title
const GET_PRODUCTS_BY_TITLE = `
  query getProductsByTitle($title: String!) {
    products(first: 10, query: $title) {
      edges {
        node {
          title
          variants(first: 100) {
            edges {
              node {
                title
                price {
                  amount
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Function to fetch products by title
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

// Function to sort variants by price and display the results
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

// Main function to execute the script
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
