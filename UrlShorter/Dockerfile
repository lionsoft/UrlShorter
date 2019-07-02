FROM mcr.microsoft.com/dotnet/core/aspnet:2.2-stretch-slim AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:2.2-stretch AS build
WORKDIR /src
COPY ["UrlShorter/UrlShorter.csproj", "UrlShorter/"]
RUN dotnet restore "UrlShorter/UrlShorter.csproj"
COPY . .
WORKDIR "/src/UrlShorter"
RUN dotnet build "UrlShorter.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "UrlShorter.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "UrlShorter.dll"]