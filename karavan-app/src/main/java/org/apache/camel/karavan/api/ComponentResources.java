/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.apache.camel.karavan.api;

import io.vertx.core.Vertx;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Path("/component")
public class ComponentResources {

    @ConfigProperty(name = "karavan.folder.components")
    String components;

    @Inject
    Vertx vertx;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<String> getList() {
        return vertx.fileSystem().readDirBlocking(Paths.get(components).toString())
                .stream()
                .filter(s -> s.endsWith(".json"))
                .map(s -> {
                    String[] parts = s.split("/");
                    return parts[parts.length - 1];
                }).collect(Collectors.toList());
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{name}")
    public String getJson(@PathParam("name") String name) {
        return vertx.fileSystem().readFileBlocking(Paths.get(components, name).toString()).toString();
    }
}
