package org.example.tecwebloja;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*")
@Controller
@RequestMapping(path= "/loja")
public class MainController {

    @Autowired
    private ProductRepository productRepository;

    // Main Page
    @GetMapping(path = "")
    public String mainPage() {
        return "forward:/pages/Index.html";
    }


    //    private Integer id;
    //    private String name;
    //    private String category;
    //    private float price;
    //    private Integer quantity;
    //    private String supplier;
    //    private String barcode;

    // POST request to add a product to lineup
    @PostMapping(path="/addProduct")
    public @ResponseBody String addProduct(@RequestParam String name, @RequestParam String category, @RequestParam float price,
                                           @RequestParam int quantity, @RequestParam String supplier, @RequestParam String barCode) {

        // create product object
        Product p = new Product();
        p.setName(name);
        p.setCategory(category);
        p.setPrice(price);
        p.setQuantity(quantity);
        p.setSupplier(supplier);
        p.setBarcode(barCode);

        // save to repo
        productRepository.save(p);
        return "Product Saved";
    }

    // GET request to get all products
    @GetMapping(path="/all")
    public @ResponseBody Iterable<Product> getAllProducts() {

        // returns JSON with products
        return productRepository.findAll();
    }

    // PUT request to update a product
    @PutMapping(path = "/update/{id}")
    public @ResponseBody String updateProduct(@PathVariable int id, @RequestParam String name,
                                              @RequestParam String category, @RequestParam float price,
                                              @RequestParam int quantity, @RequestParam String supplier, @RequestParam String barCode) {

        // edits product to new values
        // p = product
        // ep = edited product
        Optional<Product> p = productRepository.findById(id);
        if (p.isPresent()) {
            Product ep = p.get();
            ep.setName(name);
            ep.setCategory(category);
            ep.setPrice(price);
            ep.setQuantity(quantity);
            ep.setSupplier(supplier);
            ep.setBarcode(barCode);

            return "Product Updated";
        }
        return "Product Not Found";
    }

    // PUT request to update stock of a product
    @PutMapping(path = "/update/stock/{id}")
    public @ResponseBody String updateProductStock(@PathVariable int id, @RequestParam int quantity) {

        // edits product stock
        // p = product
        // ep = edited product
        Optional<Product> p = productRepository.findById(id);
        if (p.isPresent()) {
            Product ep = p.get();
            ep.setQuantity(quantity);
            productRepository.save(ep);
            return "Product Stock Updated";
        }

        return "Product Not Found";
    }

    @DeleteMapping(path = "/delete/{id}")
    public @ResponseBody String deleteProduct(@PathVariable int id) {

        Optional<Product> p = productRepository.findById(id);
        if (p.isPresent()) {
            productRepository.delete(p.get());
            return "Product Deleted Successfully";
        }
        return "Product Not Found";
    }

    @GetMapping(path = "/test")
    public @ResponseBody String test() {
        try {
            // test db connection
            long userCount = productRepository.count();

            // test if we can save a product
            Product testProduct = new Product();
            testProduct.setName("test");
            testProduct.setCategory("test");
            testProduct.setPrice(100f);
            testProduct.setQuantity(10);
            testProduct.setSupplier("test");
            testProduct.setBarcode("test");
            productRepository.save(testProduct);

            return "SUCCESS: Database connected! Product count: " +  userCount + ". Test product saved with ID " + testProduct.getId();
        } catch (Exception e) {
            return "ERROR: Database connection failed! " + e.getMessage();
        }
    }
}
