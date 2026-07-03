using Microsoft.AspNetCore.Mvc;
using HardwarePlanetApi.Models;


namespace HardwarePlanetApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Das bedeutet die API ist unter /api/products erreichbar
    public class ProductsController : ControllerBase
    {
        
        private static readonly List<Product> Products = new()
        {
            new Product { Id = 1, Name = "NVIDIA RTX 5080", Category = "Grafikkarten", Price = 1199.99m, Description = "High-End Grafikkarte für flüssiges 4K-Gaming und Raytracing.", ImageUrl = "/image/bild1.png"},
            new Product { Id = 2, Name = "AMD Ryzen 9 9950X", Category = "Prozessoren", Price = 649.00m, Description = "16-Core High-Performance Prozessor für Gamer und Creator.", ImageUrl = "/image/bild2.png" },
            new Product { Id = 3, Name = "Hardware Planet Thermal Paste", Category = "Zubehör", Price = 9.95m, Description = "Premium Wärmeleitpaste für optimales Thermal Management und geringe Hotspots.", ImageUrl = "/image/bild3.png" }, // muss noch bilder raussuchen
            new Product { Id = 4, Name = "Corsair Vengeance RGB Pro 32GB", Category = "Arbeitsspeicher", Price = 349.20m, Description = "32GB DDR4 RAM mit RGB-Beleuchtung für maximale Performance und Stil.", ImageUrl = "/image/bild4.png" }
        };
        [HttpGet]
        public ActionResult<IEnumerable<Product>> GetProducts()
        {
            return Ok(Products);
        }

        [HttpGet("{id}")]
        public ActionResult<Product> GetProductById(int id)
        {
            var product = Products.FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        [HttpPost]
        public ActionResult<Product> CreateProduct(Product product)
        {
            if (string.IsNullOrWhiteSpace(product.Name))
            {
                return BadRequest("Das product muss einen Namen haben.");
            }
            var productCheck = Products.FirstOrDefault(p => p.Id == product.Id);
            if (productCheck != null)
            {
                return BadRequest("Ein Produkt mit dieser Id existiert bereits.");
            }
            Products.Add(product);
            return Ok(product);
        }
        [HttpPut("{id}")]
        public ActionResult<Product> UpdateProduct(int id, Product product)
        {
            var existingProduct = Products.FirstOrDefault(p => p.Id == id);
            if (existingProduct == null)
            {
                return NotFound();
            }
            Products.Remove(existingProduct);
            Products.Add(product);
            return Ok(product);
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteProduct(int id)
        {
            var product = Products.FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }
            Products.Remove(product);
            return Ok();
        }
}
}