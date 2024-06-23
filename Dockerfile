#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build_with_node
WORKDIR /src

# install NodeJS 13.x
# see https://github.com/nodesource/distributions/blob/master/README.md#deb
RUN apt-get update -yq 
RUN apt-get install curl gnupg -yq 
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g yarn

FROM build_with_node AS build
COPY ["TarkovMapWebsite/TarkovMapWebsite.csproj", "TarkovMapWebsite/"]
RUN dotnet restore "TarkovMapWebsite/TarkovMapWebsite.csproj"
COPY . .
WORKDIR "/src/TarkovMapWebsite"
RUN dotnet build "TarkovMapWebsite.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TarkovMapWebsite.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TarkovMapWebsite.dll"]