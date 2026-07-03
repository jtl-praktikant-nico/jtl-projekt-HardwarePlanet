var builder = WebApplication.CreateBuilder(args);

// 1. CORS-Policy registrieren (Erlaubt deinem React-Frontend den Zugriff)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.AllowAnyOrigin()   // Erlaubt Anfragen von jeder Adresse (z. B. localhost:5173)
                  .AllowAnyMethod()   // Erlaubt GET, POST, PUT, DELETE etc.
                  .AllowAnyHeader();  // Erlaubt alle Header-Angaben
        });
});

builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // Aktiviert die Swagger-Benutzeroberfläche
}

// 2. CORS-Policy aktivieren (Muss unbedingt VOR den Controllern stehen!)
app.UseCors("AllowFrontend");

// 3. Statische Dateien aktivieren (Damit Bilder aus wwwroot geladen werden können)
app.UseStaticFiles();

app.UseAuthorization();
app.MapControllers();

app.Run();