using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/candidates")]
    [ApiController]
    public class CandidatesApiController : BaseApiController
    {
        private ICandidatesService _service = null;
        private IAuthenticationService<int> _authService = null;
        public CandidatesApiController(ICandidatesService service,
            ILogger<CandidatesApiController> logger,
            IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }
        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Candidate>> GetById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Candidate candidate = _service.GetById(id);

                if (candidate == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("candidate not found.");
                }
                else
                {
                    response = new ItemResponse<Candidate> { Item = candidate };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(CandidateAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                int id = _service.Add(model, userId);

                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }

            return result;
        }
    
        [HttpPut("{Id:int}")]
        public ActionResult<SuccessResponse> Update(CandidateUpdateRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                _service.Update(model);

                if (model == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("candidate not found.");
                }
                else
                {
                    response = new SuccessResponse();
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(iCode,response);
        }

        [HttpGet]
        public ActionResult<ItemsResponse<Candidate>> GetAll()
        {
            ActionResult result = null;

            try
            {
                List<Candidate> newList = _service.GetAll();
                if (newList == null)
                {
                    result = NotFound404(new ErrorResponse("Candidate records not found."));
                }
                else
                {
                    ItemsResponse<Candidate> response = new ItemsResponse<Candidate>();
                    response.Items = newList;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));

            }

            return result;
        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<Candidate>>> GetPaginate(int pageIndex, int pageSize)
        {
            ActionResult result = null;

            try
            {
                Paged<Candidate> paged = _service.Pagination(pageIndex, pageSize);
                if(paged == null)
                {
                    result = NotFound404(new ErrorResponse("Candidate records not found."));
                }
                else
                {
                    ItemResponse<Paged<Candidate>> response = new ItemResponse<Paged<Candidate>>();
                    response.Item = paged;
                    result = Ok200(response);
                }
            }
            catch(Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));

            }

            return result;
        }
        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);

                response = new SuccessResponse();
            }
            catch(Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }
        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<Candidate>>> Search(string query, int pageIndex, int pageSize)
        {
            ActionResult result = null;

            try
            {
                Paged<Candidate> paged = _service.SearchPaginate(query, pageIndex, pageSize);
                if(paged == null)
                {
                    result = NotFound404(new ErrorResponse("No records found that match your query."));
                }
                else
                {
                    ItemResponse<Paged<Candidate>> response = new ItemResponse<Paged<Candidate>>();
                    response.Item = paged;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }

            return result;
        }
        [HttpGet("parties")]
        public ActionResult<ItemResponse<Paged<Candidate>>> GetByPartyId(int partyId, int pageIndex, int pageSize)
        {
            ActionResult result = null;

            try
            {
                Paged<Candidate> paged = _service.GetByPartyId(partyId, pageIndex, pageSize);
                if (paged == null)
                    
                {
                    result = NotFound404(new ErrorResponse("Candidate By party Not Found"));
                    
                }
                else
                {
                    ItemResponse<Paged<Candidate>> response = new ItemResponse<Paged<Candidate>>();
                    response.Item = paged;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }

            return result;
        }

    }


     
    
}
